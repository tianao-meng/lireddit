import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const router = useRouter();
    const {data, loading}= useMeQuery();
    useEffect(() => {
        console.log('in effect: ', loading, data);
        if(!loading && !data?.me?.id){
            router.replace('/login?next='+router.pathname)
        }
    }, [loading, data, router])
}