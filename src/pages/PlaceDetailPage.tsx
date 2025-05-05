import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceDetail from '../components/place/PlaceDetail';

const PlaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Invalid place ID</div>;
  }
  
  return <PlaceDetail />;
};

export default PlaceDetailPage;