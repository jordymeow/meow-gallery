// Previous: 5.3.2
// Current: 5.3.3

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
    
    // Calculate the actual rows needed based on the last item's position
    let actualRowsNeeded = 0;
    
    if (thumbnailsLength > 0) {
        const lastIndex = thumbnailsLength;
        const zeroBasedIndex = lastIndex - 1;
        const groupIndex = Math.floor(zeroBasedIndex / 4);
        const positionInGroup = zeroBasedIndex % 4;
        const baseRow = groupIndex * 6 + 1;
        
        // Calculate the end row for the last item
        if (positionInGroup === 0 || positionInGroup === 1) {
            // Items in first row of group
            actualRowsNeeded = baseRow + 2; // baseRow + 3 - 1 (since grid-area end is exclusive)
        } else {
            // Items in second row of group  
            actualRowsNeeded = baseRow + 5; // baseRow + 6 - 1 (since grid-area end is exclusive)
        }
    }

    const style = {
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: `repeat(${actualRowsNeeded}, minmax(50px, 1fr))`,
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