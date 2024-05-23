import axios from 'axios';
import {FC, useEffect} from 'react'

interface AppProps {
    title: string
}

const App: FC <AppProps> = ({ title }) => {
    useEffect(() => {
        const getUsers = async() => {
            try {
                const { data } = await axios.get('https://randomuser.me/api/?results=10');
                console.log(data);
              } catch (error) {
                console.log(error);
              }
        }
        getUsers();
    }, []);

    return <h1>{title}</h1>
}

export default App;
