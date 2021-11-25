
import React from 'react'
import {Form, Formik} from 'formik'
import Wrapper from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button } from "@chakra-ui/react"
import { useLoginMutation, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'

// import {useRouter} from 'next/router'




const Login: React.FC<{}> = ({}) => {
        const router = useRouter();
        const [_,login] = useLoginMutation();
        return (   
                <Wrapper variant="small">

                        <Formik initialValues={{username: "", password: ""}} onSubmit={async (value ,{setErrors}) => {
                                        const res = await login({options:value});
                                        if(res.data?.login.errors) {
                                                setErrors(toErrorMap(res.data.login.errors));
                                        } else if (res.data?.login.user){
                                                router.push("/")
                                        }
                                }}>
                                {
                                        ({isSubmitting}) => (
                                                <Form>
                                                        <InputField name= "username" label= "Username" placeholder= "username"/>
                                                        <Box mt={4}>
                                                                <InputField name= "password" label= "Password" placeholder= "password" type='password'/>
                                                        </Box>
                                                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Login</Button>

                                                </Form>
                                        )
                                }
                        </Formik>
                </Wrapper>
        ) 
        
}
export default withUrqlClient(createUrqlClient) (Login);


