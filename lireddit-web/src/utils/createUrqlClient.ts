import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { pipe, tap } from 'wonka';
import { gql } from '@urql/core';
import { DeletePostMutationVariables, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { isServer } from './isServer';

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error) {
        // the error is a CombinedError with networkError and graphqlErrors properties
        if (error?.message.includes('not authenticated')) {
          Router.replace('login');
        }
      }
    })
  );
};
export const cursorPagination = ():Resolver =>  {


  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    // console.log('graphQl Type: ', entityKey)
    const allQueries = cache.inspectFields(entityKey);
    // console.log('allQueries: ', allQueries);

    const selectedQueryArr = allQueries.filter(info => info.fieldName === fieldName);
    const size = selectedQueryArr.length;
    if (size === 0) {
      return undefined;
    }
    // console.log('selectedQueryArr: ', selectedQueryArr)

    // console.log('fieldArgs: ', fieldArgs);
    const returnObj = `${entityKey}.${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log('returnObj: ', returnObj);
    const isItInTheCache = cache.resolve(returnObj, 'posts');
    // console.log('isItInTheCache: ', isItInTheCache);
    info.partial = !isItInTheCache;


    const result:string[] = [];
    let hasMore = false;
    selectedQueryArr.forEach((selectedQuery) => { 
      // const key = cache.resolveFieldByKey(entityKey, selectedQuery.fieldKey) as string;
      // console.log('selectedQuery: ', selectedQuery);
      const returnObj = `${entityKey}.${fieldName}(${stringifyVariables(selectedQuery.arguments)})`;
      // console.log('returnObj: ', returnObj)
      const data = cache.resolve(returnObj, 'posts') as string[]
      hasMore = cache.resolve(returnObj, 'hasMore') as boolean
      // console.log('data: ', data)
      result.push(...data);
    })
    // console.log(result);


    return {
      __typename: 'PaginatedPosts',
      posts:result,
      hasMore: hasMore
    };

    // const visited = new Set();
    // let result: NullArray<string> =  [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const createUrqlClient = (ssrExchange:any, ctx:any) => {
  let cookie = '';
  if(isServer()){
    cookie = ctx?.req?.headers?.cookie;
  }
  return(
        {
            url: 'http://localhost:4000/graphql',
            exchanges: [dedupExchange, cacheExchange({
              keys:{
                PaginatedPosts: () => null
              },
              resolvers:{
                Query: {
                  posts: cursorPagination()
                }
              },
              updates:{
                Mutation: {
                  deletePost: (_result, args, cache, info) => {
                    cache.invalidate({__typename:'Post', id: (args as DeletePostMutationVariables).id})
                  },
                  vote:(_result, args, cache, info) => {
                    const data = cache.readFragment(
                      gql`
                        fragment _ on Post{
                          id
                          points
                          voteStatus
                        }
                      `,
                      { id: args.postId } 
                    );
                    // console.log('data, args: ', data, args);
                    
                    if(data){
                      if(data.voteStatus === args.value){
                        return;
                      }
                      const newPoints = (data.points) + ((!data.voteStatus ? 1 : 2) * (args.value as number));
                      cache.writeFragment(
                        gql`
                          fragment _ on Post {
                            points
                            voteStatus
                          }
                        `,
                        { id: args.postId, points: newPoints, voteStatus:args.value }
                      );
                    }
 
                  },

                  createPost: (_result, args, cache, info) => {
                    const allQueries = cache.inspectFields('Query');
                
                    const selectedQueryArr = allQueries.filter(info => info.fieldName === 'posts');
                    selectedQueryArr.forEach((selectedQuery)=> {
                      cache.invalidate('Query', 'posts', selectedQuery.arguments);
                    })
                  },
                  logout:(_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
                        return {
          
                          me : null
                        }
          
                    })
                  },
                  login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
                      if (result.login.errors){
                        return query;
                      } else {
                        return {
          
                          me : result.login.user
                        }
                      }
                    })
          
                  },
                  register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
                      if (result.register.errors){
                        return query;
                      } else {
                        return {
          
                          me : result.register.user
                        }
                      }
                    })
          
                  },
                }
              }
            }),errorExchange, ssrExchange, fetchExchange],
            
            fetchOptions:{
              credentials:"include" as const,
              headers: cookie ? {
                cookie
              } : undefined
            }
      }
  )
}