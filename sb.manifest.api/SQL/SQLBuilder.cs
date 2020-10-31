using System;

namespace sb.manifest.api.SQL
{
    public class SQLBuilder
    {

        #region Person
        public static string GetPersonsListSQL()
        {
            return "SELECT * FROM v_person WHERE 1=1 "; //WHERE 1=1 ker dodajamo pogoje za search
        }
        public static string GetInsertPersonSQL()
        {
            return @"INSERT INTO person
                                (firstname, 
                                 lastname, 
                                 email, 
                                 birthdate, 
                                 address, 
                                 postalcode, 
                                 idcountry, 
                                 phone,
                                 weight,
                                 [limit],
                                 ticketprice) 
                    VALUES     (@FirstName, 
                                @LastName, 
                                @Email, 
                                Date(@BirthDate), 
                                @Address, 
                                @PostalCode, 
                                @IdCountry, 
                                @Phone,
                                @Weight,
                                @Limit,
                                @TicketPrice) ";
        }
        public static string GetSavePersonSQL()
        {
            return @"UPDATE person 
                     SET    firstname = @FirstName, 
                            lastname = @LastName, 
                            birthdate = Date(@BirthDate), 
                            email = @Email, 
                            address = @Address, 
                            postalcode = @PostalCode, 
                            idcountry = @IdCountry, 
                            phone = @Phone,
                            weight = @Weight,
                            [limit] = @Limit,
                            ticketprice = @TicketPrice
                     WHERE  id = @Id ";
        }
        public static string GetSaveSkydiversGroupSQL()
        {
            return @"DELETE FROM SkydiversGroup where IdPerson = @IdPerson;
                     INSERT INTO SkydiversGroup (IdGroup,IdPerson) VALUES(@IdGroup,@IdPerson);";

        }
        #endregion

        #region Load
        public static string GetInsertLoadSQL()
        {
            return @"INSERT INTO Load(Number,Description,IdAircraft) 
                                      VALUES(@Number,@Description,@IdAircraft)";
        }
        public static string GetSaveLoadSQL()
        {
            return @"UPDATE Load set 
                                    Description = @Description, 
                                    IdAircraft = @IdAircraft, 
                                    Number = @Number
                    WHERE Id = @Id";
        }
        public static string GetInsertPassengersToLoadSQL()
        {
            return "INSERT INTO OnLoad(IdPerson,IdLoad,IdProductSlot,IdGroup) VALUES(@IdPerson,@IdLoad,@IdProductSlot,@IdGroup)";
        }
        public static string GetLoadListSQL()
        {
            return "SELECT * FROM v_loadlist WHERE Status=0 ";
        }
        public static string GetLoadsHistoryByPersonSQL()
        {
            return "SELECT * FROM v_loadlist WHERE IdPerson = @IdPerson";
        }
        public static string GetLoadSQL()
        {
            return "SELECT * FROM v_load WHERE 1=1 ";
        }
        public static string GetConfirmLoadSQL()
        {
            return @"UPDATE Load set Status = @Status WHERE Id = @Id";
        }
        public static string GetActiveTodaySQL()
        {
            return @"WITH today as (
                    select c.Id,l.IdLoad 
                    from OnLoad l
                    inner join Person c on c.id=l.IdPerson
                    where l.date > date('now')
                    )
                    SELECT c.id, 
                           c.firstname 
                           || ' ' 
                           || c.lastname Name, 
                           CASE 
                             WHEN l.idload IS NULL THEN 0 
                             ELSE 1 
                           end           OnBoard,
                           at.AvailableTickets - IFNULL(til.Tickets,0)  AvailableTickets,
                           at.ProductName TicketName,
                           at.IdProductSlot,
                           IFNULL(c.[Limit],0) + c.Balance AvailableFunds,
                           c.IsStaff
                    FROM   v_person c 
                           INNER JOIN today t ON t.Id = c.Id 
                           LEFT JOIN onload l ON c.id = l.idPerson  AND l.idload = @IdLoad
                           LEFT JOIN V_AvailableTickets at ON at.IdPerson = c.Id 
                           LEFT JOIN V_OpenTickets til ON til.IdPerson = c.Id AND til.IdProductSlot = at.IdProductSlot
                    GROUP  BY c.id, 
                              c.firstname, 
                              c.lastname, 
                              l.idload,
                              c.IsStaff,
                              at.IdProductSlot";
        }
        public static string GetActiveSQL()
        {
            return @"SELECT c.id, 
                           l.IdLoad,
                           c.firstname 
                           || ' ' 
                           || c.lastname Name, 
                           CASE 
                             WHEN l.idload IS NULL THEN 0 
                             ELSE 1 
                           end           OnBoard,
                           at.AvailableTickets - IFNULL(til.Tickets,0)  AvailableTickets,
                           at.ProductName TicketName,
                           at.IdProductSlot,
                           IFNULL(c.[Limit],0) + c.Balance AvailableFunds,
                           c.IsStaff
                    FROM   v_person c 
                           LEFT JOIN onload l 
                                  ON c.id = l.idperson 
                                     AND l.idload = @IdLoad
                           LEFT JOIN V_AvailableTickets at ON at.IdPerson = c.Id  
                           LEFT JOIN V_OpenTickets til ON til.IdPerson = c.Id AND til.IdProductSlot = at.IdProductSlot
                           WHERE (c.firstname || ' ' || c.lastname) like @Name
                    GROUP  BY c.id, 
                              c.firstname, 
                              c.lastname, 
                              l.idload,
                              c.IsStaff,
                              at.IdProductSlot
                    LIMIT @Limit";
        }
        public static string GetMoveSlotSQL()
        {
            return @"UPDATE OnLoad set IdLoad = @IdLoadTo,Date=datetime('now', 'localtime') WHERE IdPerson = @IdPerson AND IdLoad = @IdLoadFrom";
        }
        public static string GetRemoveSlotSQL()
        {
            return @"DELETE from OnLoad WHERE IdPerson = @IdPerson AND IdLoad = @IdLoadFrom";
        }
        #endregion

        #region Post
        public static string GetPostListSQL()
        {
            return "SELECT * FROM v_post WHERE 1=1 "; //WHERE 1=1 ker dodajamo pogoje za search
        }
        public static string InsertPostLoadConfirmSQL()
        {
            return @"INSERT INTO post(
                      IdTransaction, Account, IdCompany, 
                      IdPerson, IdLoad, Description, 
                      Debit, Credit
                    ) --Odpremo terjatev do kupca konto 120/760 
                    SELECT 
                      (@IdTransaction || pl.IdPerson), 
                      acc1.DAccount, 
                      1, 
                      pl.IdPerson, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Income, 
                      ps.Outcome 
                    FROM 
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount AND acc1.DAccount IS NOT NULL 
                      LEFT JOIN v_availabletickets at ON at.IdPerson = pl.IdPerson AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      IdLoad = @IdLoad 
                    AND at.AvailableTickets is null
                    UNION 
                    SELECT 
                      (@IdTransaction || pl.IdPerson), 
                      acc1.CAccount, 
                      1, 
                      pl.IdPerson, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Outcome, 
                      ps.Income 
                    FROM 
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount AND acc1.CAccount IS NOT NULL 
                      LEFT JOIN v_AvailableTickets at ON at.IdPerson = pl.IdPerson AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      IdLoad = @IdLoad 
                    AND at.AvailableTickets is null
                    UNION 
                      --V primeru da kupec ima sredstva na kontu 230 potem poplačamo terjatev iz teh sredstev
                    SELECT 
                      (@IdTransaction || pl.IdPerson), 
                      acc.DAccount Account, 
                      1, 
                      pl.IdPerson, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Income, 
                      ps.Outcome 
                    FROM 
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN v_person c ON c.Id = pl.IdPerson 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                      LEFT JOIN v_AvailableTickets at ON at.IdPerson = pl.IdPerson AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      c.Balance > 0 
                      AND pl.IdLoad = @IdLoad 
                      AND at.AvailableTickets is null
                    UNION 
                    SELECT 
                      (@IdTransaction || pl.IdPerson), 
                      acc.CAccount Account, 
                      1, 
                      pl.IdPerson, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Outcome, 
                      ps.Income 
                    FROM 
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN V_Person c ON c.Id = pl.IdPerson 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                      LEFT JOIN v_AvailableTickets at ON at.IdPerson = pl.IdPerson AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      c.Balance > 0 
                      AND at.AvailableTickets is null
                      AND pl.IdLoad = @IdLoad";
        }
        public static string InsertPostBuyTransactionSQL()
        {
            return @"INSERT INTO post 
                                    (idtransaction, 
                                     account, 
                                     idcompany, 
                                     idperson, 
                                     description, 
                                     debit, 
                                     credit) --Odpremo terjatev do kupca konto 120/760   
                        SELECT ( @IdTransaction 
                                 || @IdPerson ), 
                               120, 
                               1, 
                               @IdPerson, 
                               @Details, 
                               @Price  Income, 
                               0       Outcome 
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdPerson ), 
                               760, 
                               1, 
                               @IdPerson, 
                               @Details, 
                               0   Income, 
                               @Price Outcome
                        -- Zapremo transakcijo s plačilom
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdPerson ), 
                               acc1.caccount, 
                               1, 
                               @IdPerson, 
                               @Details, 
                               0  Income,            
                               @Price Outcome
                        FROM   taccount acc1 
                        WHERE  acc1.id = @IdPayMethod 
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdPerson ), 
                               acc1.daccount, 
                               1, 
                               @IdPerson, 
                               @Details, 
                               @Price Income,
                               0  Outcome
                        FROM   taccount acc1 
                        WHERE acc1.id = @IdPayMethod ";
        }
        #endregion

        #region TicketPost
        public static string InsertCreditTicketsSQL()
        {
            return @"INSERT INTO TicketPost(IdPerson,IdProductSlot,IdTransaction, CTickets,TicketPrice)
                    Select 
                    @IdPerson,
                    p.Id IdProductSlot,
                    @IdTransaction,
                    @Quantity CTickets,
                    @Price/@Quantity 
                    from ProductSlot p 
                    where p.Id = @IdProduct";
        }
        public static string DebitTicketSQL()
        {
            return @"INSERT INTO TicketPost(IdPerson,IdProductSlot,IdLoad, DTickets)
                    Select 
                    pl.IdPerson,
                    ps.Id,
                    pl.IdLoad,
                    1 DTickets
                    FROM OnLoad pl 
                    INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                    INNER JOIN v_AvailableTickets t ON t.IdPerson = pl.IdPerson                 
                    where pl.IdLoad = @IdLoad";
        }
        public static string GetTicketPostListSQL()
        {
            return "SELECT * FROM v_ticketpost WHERE IdPerson = @IdPerson "; 
        }
        #endregion

        #region Invoice
        public static string GetInvoiceSQL()
        {
            return @"WITH 
                        IdTr(IdTransaction,Account) AS (
                        select IdTransaction,Account
                        from v_post 
                        where IdPerson = @IdPerson
                        and Account in (120) 
                        group by IdTransaction
                        having SUM(Credit-Debit) < 0 )
                    SELECT p.IdTransaction,p.Account, p.IdPerson, p.Person, p.Description, (p.Debit - p.Credit) Amount,p.Date,l.Id IdLoad,l.Number LoadNo, a.Registration Aircraft
                    FROM v_post p
                    INNER JOIN IdTr ON IdTr.IdTransaction = p.IdTransaction AND IdTr.Account = p.Account
                    LEFT JOIN Load l ON l.Id = p.IdLoad
                    LEFT JOIN Aircraft a ON a.Id = l.IdAircraft";
        }
        public static string InsertPostPayInvoiceSQL()
        {
            return @"INSERT INTO post(IdTransaction, Account, IdCompany, IdPerson, IdLoad, Description, Debit, Credit)
                            VALUES(@IdTransaction, @Account, @IdCompany, @IdPerson, @IdLoad, @Description, @Debit, @Credit)";
        }
        #endregion

        #region Product
        public static string GetSalesProductSQL()
        {
            return "SELECT * FROM Product order by id";
        }
        public static string GetInsertSalesProductSQL()
        {
            return @"INSERT INTO product 
                                (name, 
                                 description, 
                                 backgroundcolor, 
                                 isproductslot, 
                                 price,
                                 isfavorite) 
                    VALUES     (@Name, 
                                @Description, 
                                @BackgroundColor, 
                                @IsProductSlot, 
                                @Price,
                                @IsFavorite)";
        }
        public static string GetSaveSalesProductSQL()
        {
            return @"UPDATE product 
                     SET    name = @Name, 
                            description = @Description, 
                            backgroundcolor = @BackgroundColor, 
                            isproductslot = @IsProductSlot, 
                            price = @Price,
                            isfavorite =  @IsFavorite
                     WHERE  id = @Id ";
        }
        public static string GetDeleteSalesProductSQL()
        {
            return @"DELETE from product WHERE  id = @Id ";
        }
        #endregion

        #region ProductSlot
        public static string GetProductSlotSQL()
        {
            return "SELECT * FROM V_ProductSlot";
        }
        public static string GetInsertProductSlotSQL()
        {
            return @"INSERT INTO ProductSlot(IdProduct,Name,Description,Income,Outcome,IdAccount,IsStaffJob,EquipmentWeight) 
                                      VALUES(@IdProduct,@Name, @Description, @Income,@Outcome, @IdAccount,@IsStaffJob,@EquipmentWeight)";
        }
        public static string GetSaveProductSlotSQL()
        {
            return @"UPDATE productslot 
                        SET    NAME = @Name, 
                               description = @Description, 
                               income = @Income, 
                               outcome = @Outcome, 
                               idaccount = @IdAccount, 
                               idproduct = @IdProduct, 
                               isstaffjob = @IsStaffJob,
                               equipmentweight = @EquipmentWeight
                        WHERE  id = @Id ";
        }
        public static string GetDeleteProductSlotSQL()
        {
            return @"DELETE from productslot WHERE  id = @Id ";
        }
        #endregion

        #region Aircraft
        public static string GetAircraftSQL()
        {
            return "SELECT * FROM Aircraft";
        }
        public static string GetInsertAircraftSQL()
        {
            return @"INSERT INTO Aircraft(Registration,Type,Name,MaxSlots,MinSlots,RotationTime,Active) 
                                      VALUES(upper(@Registration),@Type,@Name,@MaxSlots,@MinSlots,@RotationTime,@Active)";
        }
        public static string GetSaveAircraftSQL()
        {
            return @"UPDATE Aircraft set 
                                    Registration = upper(@Registration), 
                                    Type = @Type, 
                                    Name = @Name,
                                    MaxSlots = @MaxSlots,
                                    MinSlots = @MinSlots, 
                                    RotationTime= @RotationTime, 
                                    Active = @Active 
                    WHERE Id = @Id";
        }
        public static string GetDeleteAircraftSQL()
        {
            return @"DELETE from Aircraft WHERE Id = @Id";
        }
        #endregion

        #region Accounts
        public static string GetAccountsSQL()
        {
            //TODO view
            return "SELECT * FROM TAccount where hidden=0";
        }
        #endregion

        #region Countries
        public static string GetCountriesSQL()
        {
            return @"SELECT * FROM Countries";
        }
        #endregion

        #region Dashboard
        public static string GetDashboardProductListSQL()
        {
            return @"SELECT * FROM V_DashboardProduct";
        }
        #endregion

        #region PayMethod
        public static string GetPayMethodSQL()
        {
            return @"SELECT * FROM TAccount where IsPayMethod=1";
        }
        #endregion

    }
}
