# Get WSDL spec

GET: http://localhost:3000/soap/wsdl

# POST data

POST: http://localhost:3000/RECOVERY_GATEWAY_EX_WS_DEV/S_CheckClaimKnock.asmx
**Request body**

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ClaimsKnockReq>
            <InsurerIdRq>STAR-90</InsurerIdRq>
            <Transaction>2024-09-24T14:30:00</Transaction>
            <LossDtRq>2024-09-20T10:15:00</LossDtRq>
            <PolicyNumberRq>PN123456789</PolicyNumberRq>
            <PolicyTypeCdRq>Auto</PolicyTypeCdRq>
            <ClaimsOccurenceRq>123-456-789</ClaimsOccurenceRq>
            <RegistrationRq>REG123456</RegistrationRq>
            <PaymentAmtRq>1500.75</PaymentAmtRq>
            <UserRq>JohnDoe</UserRq>
            <InsurerIdRs>INS67890</InsurerIdRs>
            <PolicyNumberRs>PN987654321</PolicyNumberRs>
            <ClaimsOccurenceRs>987-654-321</ClaimsOccurenceRs>
            <RegistrationRs>REG654321</RegistrationRs>
        </ClaimsKnockReq>
    </soap:Body>
</soap:Envelope>
```

# Docker

**Build & Run**

```bash
docker compose up -d
```

**Destroy**

```bash
docker compose down
```

