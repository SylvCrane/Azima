async function loadMarker(houseID) {

    const [marker, setMarker] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8082/api/marker/markerpuller/${houseID}`)
            .then((res) => {
                setMarker(res.data);
            })
            .catch((err) => {
                console.log('Cannot get teleporters');
            });
    }, []);

    return marker;
}