var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { getConfig } from '../config';
// nueva función para obtener los banners
export function getBanners() {
    return __awaiter(this, void 0, void 0, function* () {
        const { baseURL, licenseKey } = getConfig();
        const response = yield axios.get(`${baseURL}/banners/`, {
            headers: {
                'X-License-Key': licenseKey
            }
        });
        return response.data;
    });
}
