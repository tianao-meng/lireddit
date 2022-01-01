
import React from 'react'
import {Form, Formik} from 'formik'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import Wrapper from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button } from "@chakra-ui/react"
import { useMutation } from 'urql'
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withApollo } from '../utils/withApollo'

// import {useRouter} from 'next/router'

interface registerProps {

}



const Register: React.FC<registerProps> = ({}) => {
        const router = useRouter();
        const [register] = useRegisterMutation();
        return (   
                <Wrapper variant="small">

                        <Formik initialValues={{email:'', username: "", password: ""}} onSubmit={async (value ,{setErrors}) => {
                                        console.log(value);
                                        const res = await register({variables: {options:value}, update:(cache, {data}) => {
                                                cache.writeQuery<MeQuery>({
                                                     query:MeDocument,
                                                     data:{
                                                        __typename:"Query",
                                                        me:data?.register.user,
                                                     } 
                                                })
                                        }});
                                        if(res.data?.register.errors) {
                                                setErrors(toErrorMap(res.data.register.errors));
                                        } else if (res.data?.register.user){
                                                router.push("/")
                                        }
                                }}>
                                {
                                        ({isSubmitting}) => (
                                                <Form>
                                                        <InputField name= "username" label= "Username" placeholder= "username"/>
                                                        <Box mt={4}>
                                                                <InputField name= "email" label= "Email" placeholder= "email" />
                                                        </Box>
                                                        <Box mt={4}>
                                                                <InputField name= "password" label= "Password" placeholder= "password" type='password'/>
                                                        </Box>
                                                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Reigster</Button>

                                                </Form>
                                        )
                                }
                        </Formik>
                </Wrapper>
        ) 
        
}
export default withApollo({ssr: false})(Register);
