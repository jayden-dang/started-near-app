interface IFooterProps {}

const Footer = (props: IFooterProps) => {
    return (
        <footer className="max-w-[1440px] mx-auto lg:w-3/4 flex text-gray-800 px-2 py-2 z-10 text-center justify-center">
            @2023 - All rights reserved
        </footer>
    )
}

export default Footer
