
import React from 'react'
import {Form, Formik} from 'formik'
import Wrapper from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button, Flex, Link } from "@chakra-ui/react"
import { MeDocument, MeQuery, useLoginMutation} from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo'
// import {useRouter} from 'next/router'




const Login: React.FC<{}> = ({}) => {
        const router = useRouter();
        // console.log(router);
        const [login] = useLoginMutation();
        return (   
                <Wrapper variant="small">

                        <Formik initialValues={{usernameOrEmail: "", password: ""}} onSubmit={async (value ,{setErrors}) => {
                                        console.log(value);
                                        const res = await login({variables:value,update:(cache, {data}) => {
                                                cache.writeQuery<MeQuery>({
                                                     query:MeDocument,
                                                     data:{
                                                        __typename:"Query",
                                                        me:data?.login.user,
                                                     } 
                                                });
                                                cache.evict({fieldName: "posts:{}"});
                                        }});
                                        if(res.data?.login.errors) {
                                                setErrors(toErrorMap(res.data.login.errors));
                                        } else if (res.data?.login.user){
                                                if (typeof router.query.next === "string") {
                                                        router.push(router.query.next)
                                                } else {

                                                        router.push("/")
                                                }
                                        }
                                }}>
                                {
                                        ({isSubmitting}) => (
                                                <Form>
                                                        <InputField name= "usernameOrEmail" label= "Username or Email" placeholder= "username or email"/>
                                                        <Box mt={4}>
                                                                <InputField name= "password" label= "Password" placeholder= "password" type='password'/>
                                                        </Box>
                                                        <Flex mt={2}>

                                                            <NextLink  href="/forgot-password">
                                                                <Link ml="auto">Forgot Password</Link>
                                                            </NextLink>                                                        
                                                        </Flex>
                                                        <Flex  mt={4} justifyContent='center'>
                                                                <Button type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Login</Button>
                                                        </Flex>

                                                </Form>
                                        )
                                }
                        </Formik>
                </Wrapper>
        ) 
        
}
export default withApollo({ssr: false})(Login);


