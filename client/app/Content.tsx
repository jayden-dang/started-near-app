'use client'

import { useAppSelector } from "@/context/store"
import { selectIsLoading, selectWallet } from "@/features/walletSlice"
import { useEffect, useState } from "react";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Content = () => {
    const wallet = useAppSelector(selectWallet);
    const [walletReady, setWalletready] = useState(false);
    const [data, setData] = useState<number>(0);
    const isLoading = useAppSelector(selectIsLoading);
    const [isChange, setIsChange] = useState(false)

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
      setIsChange(true)
        e.preventDefault();
        let { numberInput } = e.target.elements;
        let parsedValue = parseInt(numberInput.value);

        await wallet.callMethod({
            contractId: CONTRACT_ID,
            method: "plus",
            args: { number: parsedValue },
            gas: "300000000000000"
        }).then(() => setIsChange(false)).then(() => window.location.reload());
    };

    return (
        <section className="text-gray-800 max-w-[1440px] mx-auto lg:w-3/4 px-2 py-4 justify-center flex items-center flex-col">
            <h1 className="text-[50px]">
              {isChange ? "Loading..." : data ? `${data}` : "Loading ..."}
          </h1>
            <form onSubmit={changeMessage} className="change">
                <div className="flex space-x-4">
                    <input
                        autoComplete="off"
                        defaultValue={1}
                        id="numberInput"
      className="border border-gray-600 px-4 py-2 rounded-md text-white transition-all duration-300 font-medium"
                    />
                    <button
      className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-300 hover:border-b-4 hover:border-r-4 transition-all duration-300 font-medium"
                    >
                        <span>Save</span>
                        <div className="loader"></div>
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Content
