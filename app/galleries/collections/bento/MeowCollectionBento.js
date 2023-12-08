// Previous: none
// Current: 5.1.0

import { MeowCollectionItem } from "../components/MeowCollectionItem";

export const MeowCollectionBento = ({ classId, className = '', inlineStyle, collectionThumbnails, setIsLoadingRoot }) => {

    collectionThumbnails = collectionThumbnails.filter((collectionThumbnail) => {
        if ( collectionThumbnail.error ) {
            console.error('Meow Gallery: Error loading collection thumbnail', collectionThumbnail);
            return false;
        }
        return true;
    });

    const thumbnailsLength = collectionThumbnails.length;
    const isOdd = thumbnailsLength % 2 !== 0;

    return (
      <div id={classId} className={`mgl-collection-bento ${className}`} style={inlineStyle}>
        {collectionThumbnails.map((collectionThumbnail, index) => {
            return (<MeowCollectionItem
                    key={collectionThumbnail.id}
                    collectionThumbnail={collectionThumbnail}
                    isLastItem={isOdd && index === thumbnailsLength - 1}
                    setIsLoadingRoot={setIsLoadingRoot}
                />);
        })}
      </div>
    );
  };