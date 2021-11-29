import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/dist/client/router';
import React from 'react'
import { InputField } from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';


const ChangePassword: NextPage<{token:string}>= ({token}) => {
        return (
            <Wrapper variant="small">

                <Formik initialValues={{newPassword:''}} onSubmit={async (value ,{setErrors}) => {
                                // console.log(value);
                                // const res = await login(value);
                                // if(res.data?.login.errors) {
                                //         setErrors(toErrorMap(res.data.login.errors));
                                // } else if (res.data?.login.user){
                                //         router.push("/")
                                // }
                        }}>
                        {
                                ({isSubmitting}) => (
                                        <Form>
                                                <InputField name= "newPassword" label= "New Password" placeholder= "new password" type="password"/>
                                                <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Change Password</Button>

                                        </Form>
                                )
                        }
                </Formik>
            </Wrapper>
        );
}
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string,
    }
}
export default ChangePassword;