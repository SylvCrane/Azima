import axios from 'axios';

export async function loadTeleporter(houseID) {

    const [teleporters, setTeleporters] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8082/api/teleporter/puller/${houseID}`)
            .then((res) => {
                setTeleporters(res.data);
            })
            .catch((err) => {
                console.log('Cannot get teleporters');
            });
    }, []);

    return teleporters;
}