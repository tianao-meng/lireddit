import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/dist/client/router';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withApollo } from '../utils/withApollo';


const forgotPassword: React.FC<{}> = ({}) => {
        const [complete, setComplete] = useState(false);
        const[forgotPassword] = useForgotPasswordMutation();
        return (                
                <Wrapper variant="small">

                    <Formik initialValues={{email:''}} onSubmit={async (value ,{setErrors}) => {
                                const res = await forgotPassword({variables:value});
                                setComplete(true)
                            }}>
                            {
                                    ({isSubmitting}) => complete ? <Box>if an account with that email exists, we sent you an email</Box> : (

                                            <Form>
                                                    <InputField name= "email" label= "Email" type="email" placeholder= "Please your email"/>
                                                    <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Submit</Button>

                                            </Form>
                                    )
                            }
                    </Formik>
                </Wrapper>
        );
}

export default withApollo({ssr: false})(forgotPassword);