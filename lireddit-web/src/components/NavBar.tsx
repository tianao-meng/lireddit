import { Box, Flex } from '@chakra-ui/layout'
import { Button, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
        const [{fetching:logoutFetching}, logout] = useLogoutMutation();
        const [{data, fetching}] = useMeQuery({
            pause: isServer() 
        });
        console.log(data);
        let body = null;

        // data is loading
        if (fetching) {

            // user not log in
        } else if (!data?.me){

            body = (
                <>
                    <NextLink href='/login'>
                    <Link mr={2}>Login</Link>
                    </NextLink>
                    <NextLink href='/register'>
                    <Link>Register</Link>
                    </NextLink>
                </>
            )
            //user log in
        } else {
            body =(
                <>
                    <Flex>

                        <Box mr={2}>
                            {data.me.username}
                        </Box>
                         
                         <Button onClick={()=> {logout()}} isLoading={logoutFetching} variant='link'>
                             logout
                         </Button>
                    </Flex>
                </>
            )
        }
        return (
            <Flex bg="tan" p={4}> 
                <Box ml={'auto'}>
                    {body}
                </Box>
            </Flex>
        ) 
}