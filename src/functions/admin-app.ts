import { app, HttpRequest, HttpResponseInit, InvocationContext, Timer } from "@azure/functions";
import { appName, appVersion, businessName, emailToNotify as emailFromNotify, emailToNotify, enviarCorreo } from "../global";
import { getDateTimeText } from "../common/huemul/huemul-functions";
import { getDepartmentData } from "../app/department/department-logic";
import { sendMail } from "../common/connections/connection-mail";



app.timer('EnvioCorreo', {
    schedule: "0 */2 * * * *",
    handler: async (myTimer: Timer, context: InvocationContext): Promise<void> => {
        var timeStamp = new Date().toISOString();
        if (myTimer.isPastDue)
        {
            context.log('Node is running late!');
            return;
        }
        context.log('Node timer trigger function ran!', timeStamp);  
        

        let resultFunc = {
          isOK: false,
          detail: "",
      }

      if (enviarCorreo) {
        const to: string = emailToNotify;
        const subject = `Envío de correo de prueba ${timeStamp}`;
        var message: string = "Demo de envío de correo";
            
        resultFunc = await sendMail(emailFromNotify, to, subject, message);
        if (!resultFunc.isOK) {
          console.log(`ERROR ENVIO EMAIL: ${resultFunc.detail}`);
        }
      }
    }
});

app.http('createSQL', {
    route: 'huemul/admin/create/sql/v1',
    methods: ['POST'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        //const datar: any = await request.json();
        //const data = "";
        //const data = createTableSQL(datar.moduleName ?? "moduleName NOT PROVIDED");
        const department = getDepartmentData();
        const createTable = await department.createTableDepartment();

    
        return { 
            headers: { 'Content-Type': 'application/json' },
            body: createTable
        };
    }
});


app.http('adminVersion', {
    route: 'huemul/admin/version',
    methods: ['POST'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {

        const datar: any = await request.json();
        //huemulData.body_huemul = datar
        //const datar2: any = request.body;
        const data = {
            appName,
            businessName,
            appVersion,
            yourData: datar,
            //yourData2: datar2,
            currentDate: getDateTimeText(new Date())
        }

        return {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
    }
});

