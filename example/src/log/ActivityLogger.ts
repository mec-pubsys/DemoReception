import { executeQuery } from '../aws/db/dbOperation';
import { logConfig, logMode } from "../config/appConfig";
import { DeviceInfo } from "../environments/DeviceInfo4pureTS";
import { getCurrentJapanTime } from "../environments/TimeUtils";
import { User } from "../models/User";

export class ActivityLogger {
    static readonly METHOD = 'POST';
    static readonly CITY_CODE = '242152';
    static readonly APPLICATION_NAME = 'LGaP_RECEPTION';
    static readonly DEVICE_ID = DeviceInfo.getDeviceInfo();
    static readonly LOG_LEVEL = {
        INFO: 'info'
    };

    static async insertInfoLogEntry(user: User, screenName: string, functionName: string, actionType: string, targetScreenName?: string, parameters?: any, query?: string, message?: string) {

        if (logConfig.IS_LOG_OUTPUT) {

            let queryString = `INSERT INTO user_activity_log (
            city_code
            ,application_name
            ,timestamp
            ,user_id
            ,device_id
            ,log_level
            ,screen_name
            ,function_name
            ,action_type
            ,target_screen_name
            ,parameters
            ,query
            ,message
            ) VALUES (`;
            queryString += `'${this.CITY_CODE}'`;
            queryString += `,'${this.APPLICATION_NAME}'`;
            queryString += `,'${getCurrentJapanTime()}'`;
            queryString += `,'${user.userId}'`;
            queryString += `,'${(await this.DEVICE_ID).toString()}'`;
            queryString += `,'${this.LOG_LEVEL.INFO}'`;
            queryString += `,'${screenName}'`;
            queryString += `,'${functionName}'`;
            queryString += `,'${actionType}'`;
            queryString += targetScreenName ? `,'${targetScreenName}'` : `,''`;
            queryString += parameters ? `,'${parameters.getAllValuesAsString()}'` : `,''`;
            queryString += query ? `,'` + query.replaceAll(`'`, `''`) + `'` : `,''`;
            queryString += message ? `,'${message}'` : `,''`;
            queryString += `);`;

            if (logConfig.LOG_MODE === logMode.NORMAL) {
                return executeQuery(this.METHOD, queryString);

            } else if (logConfig.LOG_MODE === logMode.DEVELOP) {
                const result = await executeQuery(this.METHOD, queryString);
                if (result.message !== 'No rows affected by query' && result.message !== 'success') {
                    alert('ERROR:ActivityLogger');
                    console.log('ERROR:ActivityLogger');
                    alert(result.message);
                    console.log(result.message);
                    alert(queryString);
                    console.log(queryString);
                }
                return result;

            } else {
                return;
            }

        }
    }
}
