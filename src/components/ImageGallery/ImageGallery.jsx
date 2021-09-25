import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import s from './ImageGallery.module.css';

import Searchbar from '../Searchbar';
import imagesApi from '../../services';
import LoaderSpiner from '../Loader';
import ImageGalleryItem from '../ImageGalleryItem';
import LoadMoreButton from '../Button';

function ImageGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetchImages();
    }
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });

  const handleFormSubmit = query => {
    setSearchQuery(query);
    setCurrentPage(1);
    setImages([]);
    setError(null);
  };

  const fetchImages = () => {
    const options = { searchQuery, currentPage };

    setIsLoading(true);

    imagesApi
      .fetchImages(options)
      .then(images => {
        if (images.length === 0) {
          setError(true);
          toast.error('Please enter a more correct request!');

          return;
        }

        setImages(state => [...state, ...images]);
        setCurrentPage( state => state + 1);
      })
      .catch(error => setError(error))
      .finally(() => setIsLoading(false));
  };

  const shouldRenderLoadMoreButton = images.length > 0 && !isLoading;

  return (
    <div className={s.Container}>
      <Searchbar onSubmit={handleFormSubmit} />
      {images && (
        <ul className={s.ImageGallery}>
          {images.map(({ webformatURL, largeImageURL, tags }) => (
            <ImageGalleryItem
              key={uuidv4()}
              webformatURL={webformatURL}
              largeImageURL={largeImageURL}
              tags={tags}
            />
          ))}
        </ul>
      )}
      {isLoading && <LoaderSpiner />}
      {shouldRenderLoadMoreButton && (
        <LoadMoreButton onClick={fetchImages}></LoadMoreButton>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
}

// ImageGallery.propTypes = {
//   images: PropTypes.arrayOf(
//     PropTypes.shape({
//       webformatURL: PropTypes.string.isRequired,
//       largeImageURL: PropTypes.string.isRequired,
//       tags: PropTypes.string.isRequired,
//     }),
//   ),
// };

export default ImageGallery;
