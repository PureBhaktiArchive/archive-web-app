/* A simple iframe wrapper that makes 16:9 responsive embed */
import React from 'react';
import tw from "twin.macro";
import SectionSeparator from '../src/components/aliveonline/section-separator'

export default ({ url }) => {
  // this is google contact form form iframe
  const FlexDiv = tw.div`flex flex-col items-center lg:block h-full `;

  url = "https://docs.google.com/forms/d/e/1FAIpQLScIUS0rJD1UkPshb-72MoFV9UN_m7CnrCAcYwgumFEiXCM_Sg/viewform?embedded=true"

  return (
    <>
      <SectionSeparator />
      <FlexDiv>
        <embed src={url} width="100%" height="1400" ></embed>
      </FlexDiv>
      <SectionSeparator />
    </>
  );
};
