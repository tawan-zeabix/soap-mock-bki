import express, { Request, Response } from "express";
const soap = require("soap");
import { createServer, Server } from "http";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
const jsontoxml = require("jsontoxml");

interface ClaimKnockReq {
	InsurerIdRq?: string;
	Transaction: string;
	LossDtRq: string;
	PolicyNumberRq?: string;
	PolicyTypeCdRq?: string;
	ClaimsOccurenceRq?: string;
	RegistrationRq?: string;
	PaymentAmtRq: number;
	UserRq?: string;
}

interface ClaimOccurence {
	ClaimNoticeCd?: string;
	ItemIdInfo?: string;
	NotifyNumber?: string;
	LossDt: string;
	KfkStatus?: string;
	ReserveAmt: number;
	PaymentAmt: number;
	PaymentTypeCd?: string;
	InDisputeInd?: string;
	WhereOccurredDesc?: string;
	LossCauseDesc?: string;
}

interface Coverage {
	CoverageCd?: string;
	CoverageDesc?: string;
	Limit: {
		LimitAmt: number;
		LimitAmtEachPerson?: number;
		LimitAmtEachAccident?: number;
	};
}

interface ClaimKnockResponse {
	RecordGUID: string;
	SPName: string;
	PolicyNumber: string;
	EffectiveDt: string;
	ExpirationDt: string;
	PersonName: string;
	PolicyTypeCd: string;
	VehTypeCd: string;
	Registration: string;
	Manufacturer: string;
	Model: string;
	ChassisSerialNumber: string;
	EngineSerialNumber: string;
	Displacement: number;
	GrossVehOrCombinedWeight: number;
	SeatingCapacity: number;
	Coverages: { Coverage: Coverage[] };
	ClaimOccurences: { ClaimOccurence: ClaimOccurence[] };
	TransactionResponseDt: string;
	MsgStatusCd: string;
}

const customer_service = {
	ClaimsKnockService: {
		ClaimsKnockPort: {
			ClaimsKnockReq(args: ClaimKnockReq): ClaimKnockResponse {
				console.log(jsontoxml({ ClaimNock: args }, { prettyPrint: true }));
				console.log("ClaimsKnockReq request body: ", args);
				return {
					RecordGUID: faker.string.uuid(),
					SPName: "ZBIX",
					PolicyNumber: args.PolicyNumberRq || "POL-001",
					EffectiveDt: new Date().toUTCString(),
					ExpirationDt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toUTCString(),
					PersonName: faker.person.fullName(),
					PolicyTypeCd: args.PolicyTypeCdRq || "AUTO",
					VehTypeCd: "CAR",
					Registration: args.RegistrationRq || "ABC123",
					Manufacturer: faker.vehicle.manufacturer(),
					Model: faker.vehicle.model(),
					ChassisSerialNumber: "CHAS123456",
					EngineSerialNumber: "ENG123456",
					Displacement: 2000,
					GrossVehOrCombinedWeight: 1500,
					SeatingCapacity: faker.number.int({ min: 2, max: 7 }),
					Coverages: {
						Coverage: [
							{
								CoverageCd: "COV001",
								CoverageDesc: "Comprehensive",
								Limit: {
									LimitAmt: faker.number.int({ min: 1000, max: 999999 }),
								},
							},
						],
					},
					ClaimOccurences: {
						ClaimOccurence: [
							{
								ClaimNoticeCd: "CLM001",
								ItemIdInfo: "ITEM001",
								NotifyNumber: "NOT001",
								LossDt: args.LossDtRq || new Date().toUTCString(),
								KfkStatus: "PENDING",
								ReserveAmt: faker.number.int({ min: 3000, max: 9999 }),
								PaymentAmt: args.PaymentAmtRq || 0,
								PaymentTypeCd: "FULL",
								InDisputeInd: "N",
							},
						],
					},
					TransactionResponseDt: new Date().toUTCString(),
					MsgStatusCd: "SUCCESS",
				};
			},
		},
	},
};

const wsdl = fs.readFileSync(path.join(__dirname, "customer_spec.wsdl"), "utf8");

const app = express();
const port = 3000;
const server = createServer(app);
const soapPath = "/RECOVERY_GATEWAY_EX_WS_DEV/S_CheckClaimKnock.asmx";

app.get("/soap/wsdl", (req, res) => {
	res.type("application/xml");
	res.send(wsdl);
});

const soapServer = soap.listen(server, soapPath, customer_service, wsdl);

soapServer.log = (type: any, data: any, req: any) => {
	console.log("Info: ", data);
};
soapServer.on("request", function (requestXML: any, methodName: any) {
	console.log("Raw SOAP request XML: ", jsontoxml(requestXML, { prettyPrint: true }));
});

soapServer.on("response", function (responseXML: any, methodName: any) {
	console.log("Raw SOAP Response XML: ", responseXML);
});
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

