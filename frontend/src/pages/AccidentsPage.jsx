import { useState, useEffect } from 'react';
import { getAccidents } from '../api/accidents';

function AccidentsPage() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return(
        <div>Accidents - soon</div>
    );
}

export default AccidentsPage;