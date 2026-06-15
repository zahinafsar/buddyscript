import type { ExtractNextBody, ExtractNextQuery, ExtractNextResponse, ExtractNextParams } from 'next-ts-api';
import type { POST as POST_1 } from '../app/api/comments/[id]/like/route';
import type { GET as GET_2 } from '../app/api/comments/[id]/replies/route';
import type { GET as GET_3, POST as POST_3 } from '../app/api/posts/[id]/comments/route';
import type { POST as POST_4 } from '../app/api/posts/[id]/like/route';
import type { GET as GET_5, POST as POST_5 } from '../app/api/posts/route';
import type { POST as POST_6 } from '../app/api/upload/route';

export type ApiRoutes = {
  'comments/[id]/like': {
    POST: {
      body: ExtractNextBody<typeof POST_1>
      response: ExtractNextResponse<typeof POST_1>
      query: ExtractNextQuery<typeof POST_1>
      params: ExtractNextParams<typeof POST_1>
    },
  };
  'comments/[id]/replies': {
    GET: {
      response: ExtractNextResponse<typeof GET_2>
      query: ExtractNextQuery<typeof GET_2>
      params: ExtractNextParams<typeof GET_2>
    },
  };
  'posts/[id]/comments': {
    GET: {
      response: ExtractNextResponse<typeof GET_3>
      query: ExtractNextQuery<typeof GET_3>
      params: ExtractNextParams<typeof GET_3>
    },
    POST: {
      body: ExtractNextBody<typeof POST_3>
      response: ExtractNextResponse<typeof POST_3>
      query: ExtractNextQuery<typeof POST_3>
      params: ExtractNextParams<typeof POST_3>
    },
  };
  'posts/[id]/like': {
    POST: {
      body: ExtractNextBody<typeof POST_4>
      response: ExtractNextResponse<typeof POST_4>
      query: ExtractNextQuery<typeof POST_4>
      params: ExtractNextParams<typeof POST_4>
    },
  };
  'posts': {
    GET: {
      response: ExtractNextResponse<typeof GET_5>
      query: ExtractNextQuery<typeof GET_5>
      params: ExtractNextParams<typeof GET_5>
    },
    POST: {
      body: ExtractNextBody<typeof POST_5>
      response: ExtractNextResponse<typeof POST_5>
      query: ExtractNextQuery<typeof POST_5>
      params: ExtractNextParams<typeof POST_5>
    },
  };
  'upload': {
    POST: {
      body: ExtractNextBody<typeof POST_6>
      response: ExtractNextResponse<typeof POST_6>
      query: ExtractNextQuery<typeof POST_6>
      params: ExtractNextParams<typeof POST_6>
    },
  };
};
