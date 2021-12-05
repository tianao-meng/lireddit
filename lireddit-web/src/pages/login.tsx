
import React from 'react'
import {Form, Formik} from 'formik'
import Wrapper from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button, Flex, Link } from "@chakra-ui/react"
import { useLoginMutation} from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link';
// import {useRouter} from 'next/router'




const Login: React.FC<{}> = ({}) => {
        const router = useRouter();
        const [_,login] = useLoginMutation();
        return (   
                <Wrapper variant="small">

                        <Formik initialValues={{usernameOrEmail: "", password: ""}} onSubmit={async (value ,{setErrors}) => {
                                        console.log(value);
                                        const res = await login(value);
                                        if(res.data?.login.errors) {
                                                setErrors(toErrorMap(res.data.login.errors));
                                        } else if (res.data?.login.user){
                                                router.push("/")
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
                                                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Login</Button>

                                                </Form>
                                        )
                                }
                        </Formik>
                </Wrapper>
        ) 
        
}
export default withUrqlClient(createUrqlClient) (Login);


