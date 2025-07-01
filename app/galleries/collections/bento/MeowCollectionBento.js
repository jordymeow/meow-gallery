// Previous: 5.1.0
// Current: 5.3.2

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
    
    // Calculate total rows needed based on the grid pattern
    // Every group of 4 items needs 6 rows (3 for top pair + 3 for bottom pair)
    const totalGroups = Math.ceil(thumbnailsLength / 4);
    const totalRows = totalGroups * 6;

    const style = {
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: `repeat(${totalRows}, minmax(50px, 1fr))`,
    };

    return (
      <div id={classId} className={`mgl-collection-bento ${className}`} style={{ ...style, ...inlineStyle }}>
        {collectionThumbnails.map((collectionThumbnail, index) => {
            return (<MeowCollectionItem
                    key={collectionThumbnail.id}
                    collectionThumbnail={collectionThumbnail}
                    isOdd={isOdd}
                    isLast={index === collectionThumbnails.length - 1}
                    index={index + 1}
                    setIsLoadingRoot={setIsLoadingRoot}
                />);
        })}
      </div>
    );
  };