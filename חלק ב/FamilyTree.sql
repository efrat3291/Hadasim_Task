--Ex1
create table Person(
    Person_Id int primary key,
	Personal_Name nvarchar(100),
	Family_Name nvarchar(100),
	Gender nvarchar(10),
	Father_Id int,
	Mother_Id int,
	Spouse_Id int,
	Foreign KEY (Father_Id) references Person(Person_Id),
	Foreign KEY (Mother_Id) references Person(Person_Id),
	Foreign KEY (Spouse_Id) references Person(Person_Id)
);

create table FamilyTree(
    Person_Id int,
	Relative_Id int,
	Connection_Type nvarchar(100),
	primary key (Person_Id, Relative_Id, Connection_Type),
    Foreign key (Person_Id) references Person(Person_Id),
	Foreign key (Relative_Id) references Person(Person_Id)
);

--Ex2
insert into FamilyTree(Person_Id, Relative_Id, Connection_Type)

--לילד- נוסיף הורים
select Person_Id, Father_Id, 'father'
from Person
where Father_Id is not null

union all

select Person_Id, Mother_Id, 'Mother'
from Person
where Mother_Id is not null

union all

--להורים נוסיף ילדים
select Father_Id, Person_Id, case When Gender='Male' then 'Son' else 'Daugter' end as Connection_Type
from Person
where Father_Id is not null

union all

select Mother_Id, Person_Id, case When Gender='Male' then 'Son' else 'Daugter' end as Connection_Type
from Person
where Mother_Id is not null

union all

--אח/ אחות
select p1.Person_Id, p2.Person_Id, case When p2.Gender='Male' then 'Brother' else 'Sister' end as Connection_Type
from Person p1
join Person p2
on p1.Father_Id=p2.Father_Id or p1.Mother_Id=p2.Mother_Id

--נוסיף בן/ בת זוג
select Spouse_Id, 'Spouse'
from Person
Where Spouse_Id is not null

union all

--השלמה לבני זוג
select p1.Spouse_Id, p2.Person_Id, 'Spouse'
from Person p1
join Person p2
on p1.Spouse_Id=p2.Person_Id
where p1.Spouse_Id is not null and p2.Spouse_Id is null






