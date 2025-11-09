import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteProduct, listProducts } from "@/services/productService";
import type { ProductResponse } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const getStockBadge = (quantity: number) => {
  if (quantity <= 0) {
    return <Badge className="bg-destructive/10 text-destructive">Out of Stock</Badge>;
  }
  if (quantity <= 10) {
    return <Badge className="bg-warning/10 text-warning">Low Stock ({quantity})</Badge>;
  }
  return <Badge className="bg-success/10 text-success">In Stock ({quantity})</Badge>;
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const products = data ?? [];

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      [product.name, product.sku].some((field) => field.toLowerCase().includes(query)),
    );
  }, [products, searchQuery]);

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      toast({
        title: "Product removed",
        description: "The product has been deleted from the catalog.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link to="/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Catalog</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isError && (
              <div className="text-destructive mb-4">
                Unable to load products. Verify the Product Service is running and try again.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && filteredProducts.length === 0 && (
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 w-32 bg-muted rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 w-20 bg-muted rounded mb-2" />
                        <div className="h-10 w-24 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-muted-foreground col-span-full text-center py-8">
                  No products found.
                </div>
              )}
              {filteredProducts.map((product: ProductResponse) => (
                <Card key={product.productId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                      </div>
                      {getStockBadge(product.availableQuantity)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/products/${product.productId}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              `Delete ${product.name}? This action cannot be undone.`,
                            );
                            if (!confirmDelete) return;
                            deleteMutation.mutate(product.productId);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
