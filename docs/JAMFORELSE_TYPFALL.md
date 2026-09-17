# Jämförelseprotokoll – rena typfall

21 typfallskörningar gjorda på kopior av TSV KNA.xlsb i **LibreOffice 26.2.4.2**. Samma indata har körts genom programmets beräkningsmotor. Microsoft Excel är inte tillgängligt; detta är en kompletterande kompatibilitetskontroll, inte en Excel-certifiering.

Grundfilens SHA-256: `a74e3bd6bb56cd1484b0c9693a578e70768d1134f14dea09f4166f630a613ae3`. Formlerna i testkopiorna har inte rättats. Inmatningar har ändrats och filerna räknats om. Omräknade kopior finns i `analysis/lo-results/` som ODS. Originalfilen och XLSB-referensen är oförändrade.

Jämförda poster: 230. Överensstämmer inom tolerans: 187. Förklarade metod-/felavvikelser: 43. Oförklarade i detta urval: 0.

Detta är ett urval av delresultat och samtliga huvudresultat i typfallen, inte alla celler i arbetsboken. ARV-avvikelser är redovisade metodskillnader och utgör inte godkänd numerisk kompatibilitet. Besluts-ID hänvisar till `BESLUT_OCH_FRAGOR.md`.

| Typfall | Resultat | Grundfil i LibreOffice | Program | Skillnad | Bedömning |
|---|---|---:|---:|---:|---|
| T01 | NNV Åtgärd 1 | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | Annuitet Åtgärd 1 | -0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T01 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | NNV Åtgärd 1 | 6125.606310 | 1323.346628 | -4802.259682 | Förklarad metod-/felavvikelse |
| T02 | Annuitet Åtgärd 1 | -4374.258191 | 155.136596 | 4529.394787 | Förklarad metod-/felavvikelse |
| T02 | treatment nuläge | 2000.000000 | 2000.000000 | 0.000000 | Överensstämmer |
| T02 | treatment efter åtgärd | 1800.000000 | 1800.000000 | 0.000000 | Överensstämmer |
| T02 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T02 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | NNV Åtgärd 1 | 612.560631 | 132.334663 | -480.225968 | Förklarad metod-/felavvikelse |
| T03 | Annuitet Åtgärd 1 | -437.425819 | 15.513660 | 452.939479 | Förklarad metod-/felavvikelse |
| T03 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | pumping nuläge | 200.000000 | 200.000000 | 0.000000 | Överensstämmer |
| T03 | pumping efter åtgärd | 180.000000 | 180.000000 | 0.000000 | Överensstämmer |
| T03 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T03 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | NNV Åtgärd 1 | 2450.242524 | 529.338651 | -1920.903873 | Förklarad metod-/felavvikelse |
| T04 | Annuitet Åtgärd 1 | -1749.703277 | 62.054638 | 1811.757915 | Förklarad metod-/felavvikelse |
| T04 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | treatment_co2 nuläge | 800.000000 | 800.000000 | 0.000000 | Överensstämmer |
| T04 | treatment_co2 efter åtgärd | 720.000000 | 720.000000 | 0.000000 | Överensstämmer |
| T04 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T04 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | NNV Åtgärd 1 | 306280.315519 | 66167.331412 | -240112.984107 | Förklarad metod-/felavvikelse |
| T05 | Annuitet Åtgärd 1 | -218712.909565 | 7756.829782 | 226469.739347 | Förklarad metod-/felavvikelse |
| T05 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | flood_damage nuläge | 20000.000000 | 20000.000000 | 0.000000 | Överensstämmer |
| T05 | flood_damage efter åtgärd | 10000.000000 | 10000.000000 | 0.000000 | Överensstämmer |
| T05 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T05 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | NNV Åtgärd 1 | 2450.242524 | 529.338651 | -1920.903873 | Förklarad metod-/felavvikelse |
| T06 | Annuitet Åtgärd 1 | -1749.703277 | 62.054638 | 1811.757915 | Förklarad metod-/felavvikelse |
| T06 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T06 | overflow_internal nuläge | 300.000000 | 300.000000 | 0.000000 | Överensstämmer |
| T06 | overflow_internal efter åtgärd | 270.000000 | 270.000000 | 0.000000 | Överensstämmer |
| T06 | overflow_external nuläge | 500.000000 | 500.000000 | 0.000000 | Överensstämmer |
| T06 | overflow_external efter åtgärd | 450.000000 | 450.000000 | 0.000000 | Överensstämmer |
| T07 | NNV Åtgärd 1 | -970.873786 | -956.734848 | 14.138939 | Förklarad metod-/felavvikelse |
| T07 | Annuitet Åtgärd 1 | 693.295063 | -112.158511 | -805.453574 | Förklarad metod-/felavvikelse |
| T07 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T07 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | NNV Åtgärd 1 | 0.000000 | -661.673314 | -661.673314 | Förklarad metod-/felavvikelse |
| T08-cost | Annuitet Åtgärd 1 | -0.000000 | -77.568298 | -77.568298 | Förklarad metod-/felavvikelse |
| T08-cost | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-cost | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | NNV Åtgärd 1 | 2965.715777 | 661.673314 | -2304.042462 | Förklarad metod-/felavvikelse |
| T08-benefit | Annuitet Åtgärd 1 | -2117.799589 | 77.568298 | 2195.367887 | Förklarad metod-/felavvikelse |
| T08-benefit | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T08-benefit | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | NNV Åtgärd 1 | -97.087379 | -382.693939 | -285.606560 | Förklarad metod-/felavvikelse |
| T09 | Annuitet Åtgärd 1 | 69.329506 | -44.863404 | -114.192911 | Förklarad metod-/felavvikelse |
| T09 | NNV Åtgärd 2 | -291.262136 | -765.387878 | -474.125742 | Förklarad metod-/felavvikelse |
| T09 | Annuitet Åtgärd 2 | 207.988519 | -89.726809 | -297.715328 | Förklarad metod-/felavvikelse |
| T09 | NNV Åtgärd 3 | -291.262136 | -1148.081817 | -856.819681 | Förklarad metod-/felavvikelse |
| T09 | Annuitet Åtgärd 3 | 207.988519 | -134.590213 | -342.578732 | Förklarad metod-/felavvikelse |
| T09 | treatment nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | treatment efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T09 | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | NNV Åtgärd 1 | 19800.000000 | 1600.000000 | -18200.000000 | Förklarad metod-/felavvikelse |
| T10-zero | Annuitet Åtgärd 1 | -19800.000000 | 160.000000 | 19960.000000 | Förklarad metod-/felavvikelse |
| T10-zero | treatment nuläge | 2000.000000 | 2000.000000 | 0.000000 | Överensstämmer |
| T10-zero | treatment efter åtgärd | 1800.000000 | 1800.000000 | 0.000000 | Överensstämmer |
| T10-zero | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-zero | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | NNV Åtgärd 1 | Saknas/fel | 200.000000 | Saknas/fel | Förklarad metod-/felavvikelse |
| T10-one | Annuitet Åtgärd 1 | Saknas/fel | 200.000000 | Saknas/fel | Förklarad metod-/felavvikelse |
| T10-one | treatment nuläge | 2000.000000 | 2000.000000 | 0.000000 | Överensstämmer |
| T10-one | treatment efter åtgärd | 1800.000000 | 1800.000000 | 0.000000 | Överensstämmer |
| T10-one | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-one | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | NNV Åtgärd 1 | Saknas/fel | 20000.000000 | Saknas/fel | Förklarad metod-/felavvikelse |
| T10-hundred | Annuitet Åtgärd 1 | Saknas/fel | 200.000000 | Saknas/fel | Förklarad metod-/felavvikelse |
| T10-hundred | treatment nuläge | 2000.000000 | 2000.000000 | 0.000000 | Överensstämmer |
| T10-hundred | treatment efter åtgärd | 1800.000000 | 1800.000000 | 0.000000 | Överensstämmer |
| T10-hundred | treatment_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | treatment_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | pumping nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | pumping efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | pumping_co2 nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | pumping_co2 efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | flood_damage nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | flood_damage efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | overflow_internal nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | overflow_internal efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | overflow_external nuläge | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T10-hundred | overflow_external efter åtgärd | 0.000000 | 0.000000 | 0.000000 | Överensstämmer |
| T11 | Klimatkostnad hjälp | 160.000000 | 160.000000 | 0.000000 | Överensstämmer |
| T12 | Trafikkostnad hjälp | 1000.000000 | 1000.000000 | 0.000000 | Överensstämmer |
| T13 | Årlig översvämningsrisk | 0.300000 | 0.300000 | 0.000000 | Överensstämmer |
| T14-30 | arv_ground stödvärde | 58.642927 | 50.336067 | -8.306860 | Förklarad metod-/felavvikelse |
| T14-30 | arv_slow stödvärde | 80.978154 | 69.507476 | -11.470679 | Förklarad metod-/felavvikelse |
| T14-30 | arv_fast stödvärde | 115.587857 | 99.214662 | -16.373196 | Förklarad metod-/felavvikelse |
| T14-40 | arv_ground stödvärde | 45.544105 | 40.454375 | -5.089731 | Förklarad metod-/felavvikelse |
| T14-40 | arv_slow stödvärde | 61.646067 | 54.785101 | -6.860966 | Förklarad metod-/felavvikelse |
| T14-40 | arv_fast stödvärde | 86.924644 | 77.161099 | -9.763545 | Förklarad metod-/felavvikelse |
| T14-50 | arv_ground stödvärde | 34.324667 | 30.572683 | -3.751985 | Förklarad metod-/felavvikelse |
| T14-50 | arv_slow stödvärde | 44.917123 | 40.062727 | -4.854396 | Förklarad metod-/felavvikelse |
| T14-50 | arv_fast stödvärde | 61.870523 | 55.107537 | -6.762986 | Förklarad metod-/felavvikelse |
| T14-60 | arv_ground stödvärde | 26.967467 | 24.598533 | -2.368935 | Förklarad metod-/felavvikelse |
| T14-60 | arv_slow stödvärde | 35.352460 | 32.319684 | -3.032775 | Förklarad metod-/felavvikelse |
| T14-60 | arv_fast stödvärde | 49.377334 | 45.012186 | -4.365148 | Förklarad metod-/felavvikelse |
| T14-70 | arv_ground stödvärde | 21.302938 | 18.624383 | -2.678555 | Förklarad metod-/felavvikelse |
| T14-70 | arv_slow stödvärde | 28.111249 | 24.576642 | -3.534607 | Förklarad metod-/felavvikelse |
| T14-70 | arv_fast stödvärde | 39.938566 | 34.916834 | -5.021732 | Förklarad metod-/felavvikelse |

## Förklaringar

- **T02:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T02:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T03:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T03:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T04:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T04:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T05:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T05:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T06:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T06:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T07:** B03: båda byggåren inkluderas. Grundfilen exkluderar byggslutåret.
- **T07:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T08-cost:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100. B05: separat årlig kostnad/nytta. Grundfilens kostnadsparameter hämtar nyttor och läggs under byggtiden.
- **T08-cost:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T08-benefit:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100. B05: separat årlig kostnad/nytta. Grundfilens kostnadsparameter hämtar nyttor och läggs under byggtiden.
- **T08-benefit:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T09:** B03/B06: byggår inkluderas, kg omräknas till kr. Grundfilen saknar omräkning och alternativ 2 hämtar alternativ 3:s klimatvärde.
- **T09:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T10-zero:** B02: nyttor börjar efter färdigställande och stannar vid analysens slutår. Grundfilen räknar efter byggtidens mittpunkt till år 100.
- **T10-zero:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T10-one:** B03: samma start/slutår ger engångskostnad. Grundfilen dividerar med 0 och döljer felet.
- **T10-one:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T10-hundred:** B03: samma start/slutår ger engångskostnad. Grundfilen dividerar med 0 och döljer felet.
- **T10-hundred:** B04: rättad annuitetsformel, samt NNV-avvikelserna ovan.
- **T14-30:** B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.
- **T14-40:** B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.
- **T14-50:** B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.
- **T14-60:** B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.
- **T14-70:** B11/B12: programmet använder analytisk P50 och investeringar inom vald horisont. Grundfilen använder slumpmässigt histogramtypvärde och annan tidsavgränsning. Ingen numerisk likvärdighet hävdas.

## Återupprepning

`scripts/typical_cases.py` skapar gemensamma indata och programresultat. `scripts/run_libreoffice_cases.py` kör på en separat LibreOffice-instans. `scripts/run_excel_cases.ps1` kör samma manifest på en dator med Microsoft Excel. `scripts/comparison_report.py` skriver detta protokoll från sparade observationer. Numerisk tolerans: max(0,01 kr, absolut referensvärde × 10⁻⁸). Fysiska hjälpvärden kontrolleras dessutom med separata strängare kodtester.

Råobservationer, formeltext, felstatus och gemensamma indata finns i `tests/fixtures/`. Tabellens skillnad är program minus grundfil. Tomma eller dolda fel redovisas som saknade, inte som nollor.
