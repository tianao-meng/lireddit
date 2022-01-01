import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';
import { withApollo } from '../../utils/withApollo';


const ChangePassword:React.FC<{}> = ({}) => {
    const router = useRouter()
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
        return (
            <Wrapper variant="small">

                <Formik initialValues={{newPassword:''}} onSubmit={async (value ,{setErrors}) => {
                                const res = await changePassword({variables:{newPassword: value.newPassword, token: typeof router.query.token === "string" ? router.query.token:''},
                                update:(cache, {data}) => {
                                    cache.writeQuery<MeQuery>({
                                         query:MeDocument,
                                         data:{
                                            __typename:"Query",
                                            me:data?.changePassword.user,
                                         } 
                                    });
                                    cache.evict({fieldName: "posts:{}"});
                                }
                            });
                                if(res.data?.changePassword.errors) {
                                    const errorMap = toErrorMap(res.data.changePassword.errors);
                                    if('token' in errorMap){
                                        setTokenError(errorMap.token);

                                    }
                                    setErrors(errorMap);
                                } else if (res.data?.changePassword.user){
                                        router.push("/")
                                }
                        }}>
                        {
                                ({isSubmitting}) => (
                                        <Form>
                                                <InputField name= "newPassword" label= "New Password" placeholder= "new password" type="password"/>
                                                {tokenError? 
                                                    <Flex>
                                                        <Box mr={4} color='red'>{tokenError}</Box> 
                                                        <NextLink  href="/forgot-password">

                                                            <Link >go forget password again</Link>
                                                        </NextLink>
                                                    </Flex>: null}
                                                <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Change Password</Button>

                                        </Form>
                                )
                        }
                </Formik>
            </Wrapper>
        );
}

export default withApollo({ssr: false})(ChangePassword);