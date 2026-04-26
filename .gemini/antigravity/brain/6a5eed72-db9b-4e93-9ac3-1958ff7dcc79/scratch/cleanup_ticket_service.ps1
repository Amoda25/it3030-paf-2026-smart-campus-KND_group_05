$path = "backend/smart-campus-api/src/main/java/com/smartcampus/ticket/service/TicketServiceImpl.java"
$c = Get-Content $path
$new = $c[0..239] + $c[285..($c.Length-1)]
$new | Set-Content $path
