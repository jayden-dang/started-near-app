'use client'

import { useAppSelector } from "@/context/store"
import { selectAccountId, selectIsLoading, selectWallet } from "@/features/walletSlice"
import { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Content = () => {
    const wallet = useAppSelector(selectWallet);
    const account = useAppSelector(selectAccountId);
    const [walletReady, setWalletready] = useState(false);
    const [data, setData] = useState<number>(0);
    const isLoading = useAppSelector(selectIsLoading);

    useEffect(() => {
        if (!isLoading && wallet) {
            setWalletready(true);
        }
    }, [isLoading, wallet]);

    useEffect(() => {
        const getData = async () => {
            if (wallet) {
                const result = await wallet.viewMethod({
                    contractId: CONTRACT_ID,
                    method: "get_number"
                });
                setData(result);
            }
        };
        getData();
    }, [walletReady]);

    const changeMessage = async (e: any) => {
        if (!wallet) {
            console.error("Wallet is not initialized");
            return;
        }
      setWalletready(false)
        e.preventDefault();
        let { numberInput } = e.target.elements;
        let parsedValue = parseInt(numberInput.value);

        await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "plus",
            args: { number: parsedValue },
            gas: "300000000000000"
        }).then(() => setWalletready(true)).then(() => window.location.reload());
    };

    return (
        <section className="text-gray-800 max-w-[1440px] mx-auto lg:w-3/4 px-2 py-4 justify-center flex items-center flex-col">
            <h1 className="text-[50px]">
                {walletReady && data != null ? `${data}` : "Loading ..."}
            </h1>
            {!account ? <ConnectButton /> : (
                <form onSubmit={changeMessage} className="change">
                    <div className="flex space-x-4">
                        <input
                            autoComplete="off"
                            defaultValue={1}
                            id="numberInput"
                            className="border border-gray-600 px-4 py-2 rounded-md text-white transition-all duration-300 font-medium"
                        />
                        <button className={`border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-300 font-medium ${!walletReady && "disabled cursor-not-allowed hover:border-b-0 hover:border-r-0 bg-gray-400"}`}
                        >
                            <span>Plus Me</span>
                            <div className="loader"></div>
                        </button>

                    </div>
                </form>
            )}
        </section>
    )
}

export default Content
