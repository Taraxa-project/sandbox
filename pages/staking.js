import Navbar from '../components/navbar';
import Walletbar from '../components/walletbar';

export default function Validator() {

    return (
        <>
            <Navbar/>
            <Walletbar pageTitle={"Staking"}/>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    return {props: {}}
  }