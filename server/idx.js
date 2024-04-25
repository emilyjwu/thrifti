import express from "express";

const app = express();
const port = 3000;
const PUBLISHABLE_KEY = "pk_test_51P9UmWAlnVITPMWk3Kl5vzD7tT6sW5ssVCr5hodGm4qXVJIPYsujWr0SrZ4f4URiHLcsgSluzsmCxMbXXxeWjzdJ00FvevaEWW";
const SECRET_KEY = "sk_test_51P9UmWAlnVITPMWkYbcqdDMJcVhSdWSDHGSNndzLtDTd6ZzTngEyubT4quun1jbbWrw3E92lRvtqwpbPW8V6GYBD000v7GnCdi";

app.listen(port, () => {
    console.log('Thrifti listeninf at http://localhost:${port}');
});



