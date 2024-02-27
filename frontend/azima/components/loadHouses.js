async function loadHouses(houseID) {

    const [houses, setHouses] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8082/api/teleporter/puller/${houseID}`)
            .then((res) => {
                setHouses(res.data);
            })
            .catch((err) => {
                console.log('Cannot get houses');
            });
    }, []);

    return houses;
}



