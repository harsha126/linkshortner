import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axiosInstance from '../utils';
import { ServerResponse } from './types';

const LinkRedirect = () => {
    const { id } = useParams();

    function openNewTab(url: string) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer'; // Security best practice
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    useEffect(() => {

        const redirect = async () => {
            if (id) {
                try {
                    const res = await axiosInstance.get<ServerResponse<{ OriginalUrl: string }>>("/" + id)
                    if (res.data.response.OriginalUrl) {
                        openNewTab(res.data.response.OriginalUrl)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }

        redirect();
    }, [id])
    return (
        <div>LinkRedirect</div>
    )
}

export default LinkRedirect