/**
 * @author @abhi-arya1
 * @fileoverview API convenience functions for the Flask server
 */

import lmcc_config from '@/lmcc_config.json'

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
        const response = await fetch(`${lmcc_config.lmcc_url}/${path}`);
        const data: AnyType = await response.json();
        return data;
    } catch (error) {
        console.error('error fetching data:', error);
        return undefined;
    }
}

/**
 * Gets an image from an api without any params
 * @param path the api endpoint path
 * @returns a blob of bytes representing an image
 */
export const fetchImageWithoutParams = async (path: string): Promise<Blob | undefined> => {
    try {
        const response = await fetch(`${lmcc_config.lmcc_url}/${path}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    } catch (error) {
        console.error('error fetching image:', error);
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
        const response = await fetch(`${lmcc_config.lmcc_url}/${path}`, {
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


/**
 * @function fetchImageWithParams
 * @param path the path to the server page
 * @param params the parameters to pass to the request
 * @returns a Blob representing the image data from the server
 */
export const fetchImageWithParams = async (path: string, params: {[key: string]: any}): Promise<Blob | undefined> => {
    try {
        const response = await fetch(`${lmcc_config.lmcc_url}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (response.ok) {
            return await response.blob();
        } else {
            console.error('Failed to fetch image from the server');
        }
    } catch (error) {
        console.error('Error while fetching image:', error);
    }
    return undefined;
}