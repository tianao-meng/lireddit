
import React from 'react'
import {Form, Formik} from 'formik'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import Wrapper from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button } from "@chakra-ui/react"
import { useMutation } from 'urql'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

// import {useRouter} from 'next/router'

interface registerProps {

}



const Register: React.FC<registerProps> = ({}) => {
        const router = useRouter();
        const [_,register] = useRegisterMutation();
        return (   
                <Wrapper variant="small">

                        <Formik initialValues={{username: "", password: ""}} onSubmit={async (value ,{setErrors}) => {
                                        const res = await register(value);
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
export default withUrqlClient(createUrqlClient) (Register);
