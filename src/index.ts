import express, { Request, Response } from "express";
const soap = require("soap");
import { createServer, Server } from "http";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import js2xmlparser from "js2xmlparser";

interface ISampleClaim {
	CLaimId: string;
}

interface ISampleClaimResponse {
	InsurerIdRq: string;
	PolicyNumberRq: string;
}

interface ClaimKnockRequest {
	InsurerIdRq?: string;
	TransactionRequestDtRq: string;
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
		LimitAmtEachPerson: number;
		LimitAmtEachAccident: number;
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

const service = {
	MockService: {
		MockServicePortType: {
			SampleClaim(args: ISampleClaim): ISampleClaimResponse {
				const xmlRequest = js2xmlparser.parse("SampleClaim", args);
				console.log("Request body XML: \n", xmlRequest);
				return {
					InsurerIdRq: "ABC-123",
					PolicyNumberRq: "XYZ-456",
				};
			},
			ClaimKnock(args: ClaimKnockRequest): ClaimKnockResponse {
				const xmlRequest = js2xmlparser.parse("ClaimKnock", args);
				console.log("Request body XML: \n", xmlRequest);
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
					SeatingCapacity: 5,
					Coverages: {
						Coverage: [
							{
								CoverageCd: "COV001",
								CoverageDesc: "Comprehensive",
								Limit: {
									LimitAmt: 100000,
									LimitAmtEachPerson: 50000,
									LimitAmtEachAccident: 100000,
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
								ReserveAmt: 5000,
								PaymentAmt: args.PaymentAmtRq || 0,
								PaymentTypeCd: "FULL",
								InDisputeInd: "N",
								WhereOccurredDesc: "City Center",
								LossCauseDesc: "Collision",
							},
						],
					},
					TransactionResponseDt: new Date().toUTCString(),
					MsgStatusCd: "SUCCESS",
				};
			},
			ClaimsKnockReqResult(args: ClaimKnockRequest): ClaimKnockResponse {
				const xmlRequest = js2xmlparser.parse("ClaimsKnockReqResult", args);
				console.log("Request body XML: \n", xmlRequest);
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
					ChassisSerialNumber: faker.vehicle.vrm(),
					EngineSerialNumber: faker.vehicle.vin(),
					Displacement: 2000,
					GrossVehOrCombinedWeight: 1500,
					SeatingCapacity: 5,
					Coverages: {
						Coverage: [
							{
								CoverageCd: "COV001",
								CoverageDesc: "Comprehensive",
								Limit: {
									LimitAmt: 100000,
									LimitAmtEachPerson: 50000,
									LimitAmtEachAccident: 100000,
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
								ReserveAmt: 5000,
								PaymentAmt: args.PaymentAmtRq || 0,
								PaymentTypeCd: "FULL",
								InDisputeInd: "N",
								WhereOccurredDesc: "City Center",
								LossCauseDesc: "Collision",
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

const wsdl = fs.readFileSync(path.join(__dirname, "bkk_insu.wsdl"), "utf8");

const app = express();
const port = 3000;
const server = createServer(app);
const soapPath = "/soap/mock";

app.get("/soap/wsdl", (req, res) => {
	res.type("application/xml");
	res.send(wsdl);
});

const soapServer = soap.listen(server, soapPath, service, wsdl);

soapServer.on("response", function (responseXML: any, methodName: any) {
	console.log("Raw SOAP Response XML: ", responseXML);
});
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

