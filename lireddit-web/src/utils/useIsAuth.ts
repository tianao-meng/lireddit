import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const router = useRouter();
    const [{data, fetching}]= useMeQuery();
    useEffect(() => {
        console.log('in effect: ', fetching, data);
        if(!fetching && !data?.me?.id){
            router.replace('/login?next='+router.pathname)
        }
    }, [fetching, data, router])
}