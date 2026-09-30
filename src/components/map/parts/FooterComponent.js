import React from 'react';
import NewFooterCarousel from './NewFooterCarousel';

const FooterComponent = ({
  showFooter,
  selectedWorker,
  visibleMarkers,
  onClose,
  onZoomOutRequested
}) => {
  return (
    <NewFooterCarousel
      showFooter={showFooter}
      selectedWorker={selectedWorker}
      visibleMarkers={visibleMarkers || []}
      isLoading={false}
      onClose={onClose}
      onZoomOutRequested={onZoomOutRequested}
      onFullListRequest={() => {
        console.log('Full list requested');
      }}
      onShrinkListRequest={() => {
        console.log('Shrink list requested');
      }}
      onExpandedChange={(expanded) => {
        console.log('Footer expanded:', expanded);
      }}
    />
  );
};

export default FooterComponent;