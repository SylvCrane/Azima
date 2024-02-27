async function loadPhotos(houseID) {

    const [images, setImages] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8082/api/image/imagepuller/${houseID}`)
            .then((res) => {
                setImages(res.data);
            })
            .catch((err) => {
                console.log('Cannot get images');
            });
    }, []);

    return images;
}