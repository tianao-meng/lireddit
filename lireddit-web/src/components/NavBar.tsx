import { Box, Flex } from '@chakra-ui/layout'
import { Button, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'
import {useRouter} from 'next/router'
import { useApolloClient } from '@apollo/client'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
        const router = useRouter();
        const [logout, {loading:logoutFetching}] = useLogoutMutation();
        const apolloClient = useApolloClient();
        const {data, loading} = useMeQuery({
            skip: isServer() 
        });
        console.log(data);
        let body = null;

        // data is loading
        if (loading) {

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
                    <Flex alignItems="center">
                        <NextLink href='/create-post'>
                            <Button as={Link} mr={4} bg="white">
                                Create Post
                            </Button>
                        </NextLink>
                        <Box mr={2} >
                            {data.me.username}
                        </Box>
                         
                         <Button onClick={async ()=> {
                             await logout();
                            //  router.reload();
                             await apolloClient.resetStore();
                            }} 
                            isLoading={logoutFetching} variant='link'
                        >
                             logout
                         </Button>
                    </Flex>
                </>
            )
        }
        return (
            <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
                <Flex alignItems="center" maxW={800} flex={1} m="auto">
                    <NextLink href="/">
                        <Link>
                            <Heading>
                                Lireddit
                            </Heading>
                        </Link>
                    </NextLink>
                    <Box ml={'auto'}>
                        {body}
                    </Box>
                </Flex>
            </Flex>
        ) 
}