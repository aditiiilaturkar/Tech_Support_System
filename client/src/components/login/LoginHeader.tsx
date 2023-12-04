import { Link } from 'react-router-dom';
interface HeaderProps {
    heading: string;
    paragraph: string;
    linkName: string;
    linkUrl?: string;
}

export default function Header({
    heading,
    paragraph,
    linkName,
    linkUrl
} : HeaderProps){
    return(
        <div className="mb-4">
            <div className="flex justify-center">
                <img 
                    alt=""
                    className="h-28 w-28"
                    src="https://oahwebsitestorage.blob.core.windows.net/files/OAH_Logo.png"/>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 ">
            {paragraph} {' '}
            </p>
            {(linkUrl?.length && linkUrl?.length > 2) ? (
                <Link to="/signUp" className='ml-6' onClick={() => {
                    // console.log("\n im clicked!")
                }}>
                    Sign up here
                </Link>

            ): null}
        </div>
    )
}