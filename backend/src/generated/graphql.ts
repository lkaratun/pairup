import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};



export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  activitytype?: Maybe<ActivityType>;
  activityTypes?: Maybe<Array<Maybe<ActivityType>>>;
  location?: Maybe<Location>;
  locations?: Maybe<Array<Maybe<Location>>>;
  ad?: Maybe<Ad>;
  ads?: Maybe<Array<Maybe<Ad>>>;
  adResponse?: Maybe<AdResponse>;
  adResponses?: Maybe<Array<Maybe<AdResponse>>>;
  currentUser?: Maybe<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryActivityTypeArgs = {
  id: Scalars['ID'];
};


export type QueryLocationArgs = {
  id: Scalars['ID'];
};


export type QueryAdArgs = {
  id: Scalars['ID'];
};


export type QueryAdResponseArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  activitytype?: Maybe<ActivityType>;
  createActivityType?: Maybe<ActivityType>;
  location?: Maybe<Location>;
  createLocation?: Maybe<Location>;
  ad?: Maybe<Ad>;
  createAd?: Maybe<Ad>;
  createAdResponse?: Maybe<AdResponse>;
  deleteAdResponse?: Maybe<AdResponse>;
  register?: Maybe<User>;
  logIn?: Maybe<User>;
  logOut?: Maybe<Scalars['Boolean']>;
};


export type MutationUserArgs = {
  id: Scalars['ID'];
  data?: Maybe<UserInput>;
};


export type MutationActivityTypeArgs = {
  id: Scalars['ID'];
  data?: Maybe<ActivityTypeInput>;
};


export type MutationCreateActivityTypeArgs = {
  data?: Maybe<ActivityTypeInput>;
};


export type MutationLocationArgs = {
  id: Scalars['ID'];
  data?: Maybe<LocationInput>;
};


export type MutationCreateLocationArgs = {
  data: LocationInput;
};


export type MutationAdArgs = {
  id: Scalars['ID'];
  data?: Maybe<ModifyAdInput>;
};


export type MutationCreateAdArgs = {
  data?: Maybe<NewAdInput>;
};


export type MutationCreateAdResponseArgs = {
  data?: Maybe<NewAdResponseInput>;
};


export type MutationDeleteAdResponseArgs = {
  id: Scalars['ID'];
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  googleAccessToken?: Maybe<Scalars['String']>;
  googleRefreshToken?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  ads?: Maybe<Array<Maybe<Ad>>>;
  adResponses?: Maybe<Array<Maybe<AdResponse>>>;
};

export type UserInput = {
  email?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type ActivityType = {
  __typename?: 'ActivityType';
  id: Scalars['ID'];
  name: Scalars['String'];
  ads?: Maybe<Array<Maybe<Ad>>>;
};

export type ActivityTypeInput = {
  name?: Maybe<Scalars['String']>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID'];
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  ads?: Maybe<Array<Maybe<Ad>>>;
};

export type LocationInput = {
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type Ad = {
  __typename?: 'Ad';
  id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  activitytype?: Maybe<ActivityType>;
  location?: Maybe<Location>;
  user?: Maybe<User>;
  responses?: Maybe<Array<Maybe<AdResponse>>>;
};

export type ModifyAdInput = {
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['ID']>;
  activitytypeId?: Maybe<Scalars['ID']>;
  locationId?: Maybe<Scalars['ID']>;
};

export type NewAdInput = {
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
  activitytypeId: Scalars['ID'];
  locationId: Scalars['ID'];
};

export type AdResponse = {
  __typename?: 'AdResponse';
  id: Scalars['String'];
  ad: Ad;
  user: User;
};

export type NewAdResponseInput = {
  adId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  ActivityType: ResolverTypeWrapper<ActivityType>;
  ActivityTypeInput: ActivityTypeInput;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  Ad: ResolverTypeWrapper<Ad>;
  ModifyAdInput: ModifyAdInput;
  NewAdInput: NewAdInput;
  AdResponse: ResolverTypeWrapper<AdResponse>;
  NewAdResponseInput: NewAdResponseInput;
  RegisterInput: RegisterInput;
  CacheControlScope: CacheControlScope;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Query: {};
  ID: Scalars['ID'];
  Mutation: {};
  User: User;
  UserInput: UserInput;
  ActivityType: ActivityType;
  ActivityTypeInput: ActivityTypeInput;
  Location: Location;
  LocationInput: LocationInput;
  Ad: Ad;
  ModifyAdInput: ModifyAdInput;
  NewAdInput: NewAdInput;
  AdResponse: AdResponse;
  NewAdResponseInput: NewAdResponseInput;
  RegisterInput: RegisterInput;
  Upload: Scalars['Upload'];
  Int: Scalars['Int'];
};

export type AuthRequiredDirectiveArgs = {  };

export type AuthRequiredDirectiveResolver<Result, Parent, ContextType = any, Args = AuthRequiredDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CacheControlDirectiveArgs = {   maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>; };

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  activitytype?: Resolver<Maybe<ResolversTypes['ActivityType']>, ParentType, ContextType, RequireFields<QueryActivityTypeArgs, 'id'>>;
  activityTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['ActivityType']>>>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Location']>>>, ParentType, ContextType>;
  ad?: Resolver<Maybe<ResolversTypes['Ad']>, ParentType, ContextType, RequireFields<QueryAdArgs, 'id'>>;
  ads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ad']>>>, ParentType, ContextType>;
  adResponse?: Resolver<Maybe<ResolversTypes['AdResponse']>, ParentType, ContextType, RequireFields<QueryAdResponseArgs, 'id'>>;
  adResponses?: Resolver<Maybe<Array<Maybe<ResolversTypes['AdResponse']>>>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUserArgs, 'id'>>;
  activitytype?: Resolver<Maybe<ResolversTypes['ActivityType']>, ParentType, ContextType, RequireFields<MutationActivityTypeArgs, 'id'>>;
  createActivityType?: Resolver<Maybe<ResolversTypes['ActivityType']>, ParentType, ContextType, RequireFields<MutationCreateActivityTypeArgs, never>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationLocationArgs, 'id'>>;
  createLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<MutationCreateLocationArgs, 'data'>>;
  ad?: Resolver<Maybe<ResolversTypes['Ad']>, ParentType, ContextType, RequireFields<MutationAdArgs, 'id'>>;
  createAd?: Resolver<Maybe<ResolversTypes['Ad']>, ParentType, ContextType, RequireFields<MutationCreateAdArgs, never>>;
  createAdResponse?: Resolver<Maybe<ResolversTypes['AdResponse']>, ParentType, ContextType, RequireFields<MutationCreateAdResponseArgs, never>>;
  deleteAdResponse?: Resolver<Maybe<ResolversTypes['AdResponse']>, ParentType, ContextType, RequireFields<MutationDeleteAdResponseArgs, 'id'>>;
  register?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data'>>;
  logIn?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationLogInArgs, 'email' | 'password'>>;
  logOut?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleAccessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleRefreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ad']>>>, ParentType, ContextType>;
  adResponses?: Resolver<Maybe<Array<Maybe<ResolversTypes['AdResponse']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityType'] = ResolversParentTypes['ActivityType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ad']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ad']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ad'] = ResolversParentTypes['Ad']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activitytype?: Resolver<Maybe<ResolversTypes['ActivityType']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  responses?: Resolver<Maybe<Array<Maybe<ResolversTypes['AdResponse']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdResponse'] = ResolversParentTypes['AdResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ad?: Resolver<ResolversTypes['Ad'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  ActivityType?: ActivityTypeResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Ad?: AdResolvers<ContextType>;
  AdResponse?: AdResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  AuthRequired?: AuthRequiredDirectiveResolver<any, any, ContextType>;
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;