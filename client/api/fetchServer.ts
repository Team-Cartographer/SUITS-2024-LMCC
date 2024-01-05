/**
 * @author @abhi-arya1
 * @fileoverview API convenience functions for the Flask server
 */


/**
 * @function fetchWithParams
 * @argument AnyType the type of data you are expecting, as seen in the example
 * @param path the path to the server page
 * @returns the data from the server page you requested
 * @example
 * const [text, setText] = useState('Loading Flask...');
 * useEffect(() => {
 *  fetchWithoutParams<{ message: string }>('tests/hello').then((data) => {
 *  if (data?.message) {
 *      console.log("Message: ", data.message);
 *      setText(data.message);
 *     }
 *  })
 * }, [text]);
 */
export const fetchWithoutParams = async <AnyType = any>(path: string) => {
    try {
        const response = await fetch(`http://localhost:3001/${path}`);
        const data: AnyType = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('error fetching data:', error);
        return undefined;
    }
}


/**
 * @function fetchWithParams
 * @argument AnyType the type of data you are expecting, as seen in the example
 * @param path the path to the server page
 * @param params the parameters to pass to the request
 * @returns the data from the server page you requested
 */
export const fetchWithParams = async <AnyType = any>(path: string, params: {[key: string]: any}) => {
    try {
        const response = await fetch(`http://localhost:3001/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (response.ok) {
            const responseData: AnyType = await response.json();
            return responseData
        } else {
            console.error('failed to fetch data from the server');
        }
    } catch (error) {
        console.error('error while fetching data:', error);
    }
}