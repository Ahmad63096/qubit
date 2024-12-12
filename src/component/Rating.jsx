import React from 'react';

function Rating() {
  const handleRatingChange = (event) => {
    console.log(event.target.value);
  };

  return (
    <>
      <div className="star-rating">
        <input type="radio" id="5-stars" name="rating" value="5" onChange={handleRatingChange} />
        <label htmlFor="5-stars" className="star">&#9733;</label>
        <input type="radio" id="4-stars" name="rating" value="4" onChange={handleRatingChange} />
        <label htmlFor="4-stars" className="star">&#9733;</label>
        <input type="radio" id="3-stars" name="rating" value="3" onChange={handleRatingChange} />
        <label htmlFor="3-stars" className="star">&#9733;</label>
        <input type="radio" id="2-stars" name="rating" value="2" onChange={handleRatingChange} />
        <label htmlFor="2-stars" className="star">&#9733;</label>
        <input type="radio" id="1-star" name="rating" value="1" onChange={handleRatingChange} />
        <label htmlFor="1-star" className="star">&#9733;</label>
      </div>
      <textarea name="" id="" placeholder='Feedback' rows="2" cols="25"></textarea>
    </>
  );
}

export default Rating;
