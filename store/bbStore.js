import { initState } from './store';

const bbStore = () =>
{
  const setDonors = (donors, globalState) => ({donors});
  const setNews = (news, globalState) => ({news});

  const initialState = (payload, globalState) => ({
      donors: [],
      news: [],
    });
  
  return initState({
    initialState, 
    setDonors, 
    setNews
  })
}


export default bbStore;