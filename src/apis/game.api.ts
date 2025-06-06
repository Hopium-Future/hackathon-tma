
import { GameInformation, GameResult } from "@/type/game.type";
import baseAxios from "./base.api";

export const gamePlayApi = (side: string) => {
    return baseAxios.post<GameInformation>("/game/play",
        {
            side
        }
    );
};

export const getResultByIdApi = (id: string) => {
    return baseAxios.get<GameResult>(`/game/turns/${id}`);
}

