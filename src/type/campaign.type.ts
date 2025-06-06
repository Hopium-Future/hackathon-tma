export interface Campaign {
  id: number;
  title: string;
  description: string;
  logo: string;
  background: string;
  status: number;
  startDate: string;
  endDate: string;
  ruleContent: string;
  totalReward: TotalReward[];
}

export interface TotalReward {
  assetId: number;
  assetQuantity: number;
}

export interface LeaderboardResponse {
  ranking: Ranking[];
  me: Me;
}

export interface Ranking {
  rank: number;
  username: string;
  score: number;
  photoUrl: string;
  firstName: string;
  lastName: string;
}

export interface Me {
  rank: number;
  username: string;
  score: number;
}

export interface Reward {
  assetId: number
  assetQuantity: number
}
