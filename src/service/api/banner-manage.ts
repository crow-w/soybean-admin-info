import { demoRequest } from '../request';

/** get banner list */
export function fetchGetBannerList(params?: Api.Common.CommonSearchParams) {
  return demoRequest<Api.BannerManagement.BannerList>({
    url: '/bannerManage/getBannerList',
    method: 'get',
    params
  });
}
