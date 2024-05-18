import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import ChecklistIcon from '@mui/icons-material/Checklist';

interface Props {
    heading: ReactNode;
    paragraph: ReactNode;
    linkName: ReactNode;
    linkUrl: string;
}

export default function Header({
    heading,
    paragraph,
    linkName,
    linkUrl = "#"
}: Props) {
    return (
        <div className="mb-10 text-center">
            <ChecklistIcon />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="text-center text-sm text-gray-600 mt-5">
                {paragraph} {' '}
                <Link to={linkUrl} className="font-medium text-blue-600 hover:text-blue-500">
                    {linkName}
                </Link>
            </p>
        </div>
    )
}