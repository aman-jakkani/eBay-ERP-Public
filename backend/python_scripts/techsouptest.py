
import sys
sys.path.append('./python_modules/lib/python3.7/site-packages')
print(sys.path)
import os
print(os. getcwd())
from bs4 import BeautifulSoup
import time
from datetime import datetime, timedelta
import mechanicalsoup

html = """<tbody>









				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1591524&amp;invs=1">2140124</a>
					</td>
					<td data-title="Title" wrap="">AirPods - Tested Working</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">67&nbsp;</td>
					<td data-title="Bids $">

							$5,979

					</td>
					 <td data-title="Price/Unit">

							$89.24

					</td>
					<td data-title="Bids">17</td>
					<td data-title="Total">$6,011.64</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 12/23/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1591524">
						<input type="hidden" name="auctionID" value="2140124">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1590350&amp;invs=1">2139205</a>
					</td>
					<td data-title="Title" wrap="">Samsung Galaxy Buds &amp; More SAL...</td>
					<td data-title="Condition">Salvage&nbsp;</td>
					<td data-title="QTY">82&nbsp;</td>
					<td data-title="Bids $">

							$618

					</td>
					 <td data-title="Price/Unit">

							$7.54

					</td>
					<td data-title="Bids">7</td>
					<td data-title="Total">$815.70</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 12/13/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1590350">
						<input type="hidden" name="auctionID" value="2139205">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1578691&amp;invs=1">2125609</a>
					</td>
					<td data-title="Title" wrap="">Apple Watches No Bands Tested ...</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">6&nbsp;</td>
					<td data-title="Bids $">

							$1,550

					</td>
					 <td data-title="Price/Unit">

							$258.33

					</td>
					<td data-title="Bids">21</td>
					<td data-title="Total">$1,605.64</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 10/16/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1578691">
						<input type="hidden" name="auctionID" value="2125609">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1577347&amp;invs=1">2124453</a>
					</td>
					<td data-title="Title" wrap="">Speakers, Headphones &amp; More RE...</td>
					<td data-title="Condition">Returns&nbsp;</td>
					<td data-title="QTY">1826&nbsp;</td>
					<td data-title="Bids $">

							$28,405

					</td>
					 <td data-title="Price/Unit">

							$15.56

					</td>
					<td data-title="Bids">44</td>
					<td data-title="Total">$29,701.53</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 10/16/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1577347">
						<input type="hidden" name="auctionID" value="2124453">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1575566&amp;invs=1">2122438</a>
					</td>
					<td data-title="Title" wrap="">Apple iMac Desktops - Tested W...</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">10&nbsp;</td>
					<td data-title="Bids $">

							$905

					</td>
					 <td data-title="Price/Unit">

							$90.50

					</td>
					<td data-title="Bids">9</td>
					<td data-title="Total">$1,090.07</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 10/08/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1575566">
						<input type="hidden" name="auctionID" value="2122438">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1573931&amp;invs=1">2120644</a>
					</td>
					<td data-title="Title" wrap="">Apple Watches No Band Tested W...</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">2&nbsp;</td>
					<td data-title="Bids $">

							$555

					</td>
					 <td data-title="Price/Unit">

							$277.50

					</td>
					<td data-title="Bids">17</td>
					<td data-title="Total">$584.13</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 09/24/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1573931">
						<input type="hidden" name="auctionID" value="2120644">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1573926&amp;invs=1">2120640</a>
					</td>
					<td data-title="Title" wrap="">Apple AIrPods - Tested Working</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">87&nbsp;</td>
					<td data-title="Bids $">

							$9,056

					</td>
					 <td data-title="Price/Unit">

							$104.09

					</td>
					<td data-title="Bids">28</td>
					<td data-title="Total">$9,325.53</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 10/02/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1573926">
						<input type="hidden" name="auctionID" value="2120640">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1572141&amp;invs=1">2118729</a>
					</td>
					<td data-title="Title" wrap="">Apple iPhone's TESTED WORKING</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">12&nbsp;</td>
					<td data-title="Bids $">

							$700

					</td>
					 <td data-title="Price/Unit">

							$58.33

					</td>
					<td data-title="Bids">13</td>
					<td data-title="Total">$734.74</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 09/12/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1572141">
						<input type="hidden" name="auctionID" value="2118729">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1554606&amp;invs=1">2099450</a>
					</td>
					<td data-title="Title" wrap="">Headphones: Insignia, Sony &amp; M...</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">75&nbsp;</td>
					<td data-title="Bids $">

							$455

					</td>
					 <td data-title="Price/Unit">

							$6.07

					</td>
					<td data-title="Bids">3</td>
					<td data-title="Total">$641.61</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 06/24/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1554606">
						<input type="hidden" name="auctionID" value="2099450">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>







				<tr>
					<td data-title="Auction ID">
						<a href="https://techliquidators.com/index.cfm?p=16&amp;AppSaleId=1552202&amp;invs=1">2096649</a>
					</td>
					<td data-title="Title" wrap="">JBL &amp; Insignia Speakers Grades...</td>
					<td data-title="Condition">Used - Working&nbsp;</td>
					<td data-title="QTY">5&nbsp;</td>
					<td data-title="Bids $">

							$131

					</td>
					 <td data-title="Price/Unit">

							$26.15

					</td>
					<td data-title="Bids">7</td>
					<td data-title="Total">$163.13</td>
					<td data-title="Status"><span style="color:#00aa00;">Paid 06/12/19</span>


						<form name="getsupport" method="post" action="/tl/?action=info_support.supportform">
						<input type="hidden" name="appSaleID" value="1552202">
						<input type="hidden" name="auctionID" value="2096649">
						<input type="hidden" name="supportType" value="invoice">
						<input type="submit" class="btn btn-default btn-xs" value="Request Support">
						</form>
					</td>
				</tr>

			</tbody>"""




soup = BeautifulSoup(html,'html.parser').tbody

tr = soup.find_all("tr")
def formatValue(value):
    formattedValue = value.get_text().strip().replace("\n","").replace("\t","")
    return formattedValue



for i in range(0,1):
    value = tr[i].find_all('td')
    FMT = '%m/%d/%y'
    # datestr = value[-1]
    # date = datetime.strptime(formatValue(value[8]).split(" ")[1], FMT)
    # print(date)
    #creating dictionary to pass
    date = datetime.strptime(formatValue(value[8]).split(" ")[1], FMT)

    manifest = {
    "auction_title" : formatValue(value[1]),
    "auction_id": int(formatValue(value[0])),
    "transaction_id" : int(value[8].form.find("input",{"name":"appSaleID"}).get("value")),
    "quantity" : int(formatValue(value[3])),
    "total_price" : int("".join(filter(str.isdigit, formatValue(value[4]))))/100,
    "date_purchased" : date,
    "status" : formatValue(value[8]).split(" ")[0],
    "source" : "techliquidator.com" }


    print(manifest)
    print()
